export interface CollectionContext {
  contextId: string;
  academyId: string;
}
export type EventBody = {
  eventId: string;
  occurredAt: string;
  [key: string]: unknown;
};
const RETRY_STATUSES = new Set([408, 429, 500, 502, 503, 504]);
const DAY = 86_400_000;
/** A route owns this bounded, memory-only queue. Retries reuse serialized bytes. */
export class EventQueue {
  private pending = new Map<
    string,
    {
      timer?: ReturnType<typeof setTimeout>;
      cancelled: boolean;
      inFlight: boolean;
    }
  >();
  private closed = false;
  constructor(
    readonly context: CollectionContext,
    private fetchImpl: typeof fetch = fetch,
    private onMismatch: () => void = () => {},
  ) {}
  get size() {
    return this.pending.size;
  }
  offer(
    path: "profile-visits" | "feed-events",
    event: EventBody,
    expiresAt = Infinity,
  ) {
    if (
      this.closed ||
      this.pending.size >= 100 ||
      this.pending.has(event.eventId)
    )
      return;
    const deadline = Math.min(Date.parse(event.occurredAt) + DAY, expiresAt);
    if (Date.now() >= deadline) return;
    const body = JSON.stringify(event);
    const job: {
      timer?: ReturnType<typeof setTimeout>;
      cancelled: boolean;
      inFlight: boolean;
    } = { cancelled: false, inFlight: false };
    this.pending.set(event.eventId, job);
    const attempt = async (index: number) => {
      if (this.closed || job.cancelled || Date.now() >= deadline) {
        this.pending.delete(event.eventId);
        return;
      }
      job.inFlight = true;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      let retry = false;
      let delay = 1000 * 2 ** index;
      try {
        const fetchImpl = this.fetchImpl;
        const response = await fetchImpl(
          `/api/backend/v1/academies/${this.context.academyId}/${path}`,
          {
            method: "POST",
            credentials: "same-origin",
            cache: "no-store",
            keepalive: true,
            headers: {
              "Content-Type": "application/json",
              "X-Crabit-Behavior-Context": this.context.contextId,
            },
            body,
            signal: controller.signal,
          },
        );
        if (response.status === 409) {
          const error = await response
            .clone()
            .json()
            .catch(() => null);
          if (
            error?.code === "BEHAVIOR_CONTEXT_MISMATCH" &&
            !this.closed &&
            !job.cancelled
          ) {
            this.dispose();
            this.onMismatch();
          }
        }
        retry = RETRY_STATUSES.has(response.status);
        const retryAfter = response.headers.get("Retry-After");
        if (retryAfter) {
          const parsed = /^\d+$/.test(retryAfter)
            ? Number(retryAfter) * 1000
            : Date.parse(retryAfter) - Date.now();
          if (Number.isFinite(parsed) && parsed >= 0)
            delay = Math.max(delay, parsed);
        }
      } catch {
        retry = true;
      } finally {
        clearTimeout(timeout);
        job.inFlight = false;
      }
      if (
        retry &&
        !this.closed &&
        !job.cancelled &&
        this.pending.has(event.eventId) &&
        index < 3 &&
        Date.now() + delay < deadline
      )
        job.timer = setTimeout(() => void attempt(index + 1), delay);
      else this.pending.delete(event.eventId);
    };
    void attempt(0);
  }
  discardPending() {
    for (const [id, job] of this.pending) {
      clearTimeout(job.timer);
      job.cancelled = true;
      // A dispatched request may finish, but still occupies capacity until it settles.
      if (!job.inFlight) this.pending.delete(id);
    }
  }
  dispose() {
    this.closed = true;
    this.discardPending();
  }
}
export interface FeedIdentity {
  resultContextId: string;
  cardId: string;
  position: number;
  expiresAt: number;
}
/** Registry entries survive render/DOM attachment replay; hidden time never contributes to dwell. */
export class Impression {
  private id: string | null = null;
  private timer?: ReturnType<typeof setTimeout>;
  private exposed = false;
  private qualifying = false;
  constructor(
    private identity: FeedIdentity,
    private queue: EventQueue,
  ) {}
  visibility(qualifies: boolean) {
    if (!qualifies) {
      this.end();
      return;
    }
    if (!this.qualifying) {
      this.qualifying = true;
      this.id ??= crypto.randomUUID();
    }
    if (!this.exposed && !this.timer)
      this.timer = setTimeout(() => {
        this.timer = undefined;
        this.exposed = true;
        this.emit("FEED_EXPOSURE");
      }, 1000);
  }
  detach() {
    clearTimeout(this.timer);
    this.timer = undefined;
    this.qualifying = false;
  }
  end() {
    this.detach();
    this.id = null;
    this.exposed = false;
  }
  click() {
    this.id ??= crypto.randomUUID();
    this.emit("FEED_CLICK");
  }
  private emit(eventType: "FEED_CLICK" | "FEED_EXPOSURE") {
    const { expiresAt, ...identity } = this.identity;
    this.queue.offer(
      "feed-events",
      {
        ...identity,
        eventId: crypto.randomUUID(),
        occurredAt: new Date().toISOString(),
        impressionId: this.id,
        eventType,
        ...(eventType === "FEED_CLICK" ? { clickKind: "AUTHOR_PROFILE" } : {}),
      },
      expiresAt,
    );
  }
}
