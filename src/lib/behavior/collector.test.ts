import { afterEach, expect, it, vi } from "vitest";
import { EventQueue, Impression } from "./collector";
afterEach(() => vi.useRealTimers());
const context = { academyId: "academy", contextId: "original-context" };
function event() {
  return {
    eventId: crypto.randomUUID(),
    occurredAt: new Date().toISOString(),
    targetStudentId: "student",
  };
}
it("retries the identical bytes and context at most three times", async () => {
  vi.useFakeTimers();
  const fetcher = vi
    .fn()
    .mockResolvedValue(new Response(null, { status: 503 }));
  const queue = new EventQueue(context, fetcher);
  queue.offer("profile-visits", event());
  await vi.runAllTimersAsync();
  expect(fetcher).toHaveBeenCalledTimes(4);
  expect(new Set(fetcher.mock.calls.map((call) => call[1].body)).size).toBe(1);
  expect(queue.size).toBe(0);
});
it("capacity counts in-flight events and drops new overflow", () => {
  const fetcher = vi.fn(() => new Promise<Response>(() => {}));
  const queue = new EventQueue(context, fetcher);
  for (let i = 0; i < 101; i++) queue.offer("profile-visits", event());
  expect(queue.size).toBe(100);
  expect(fetcher).toHaveBeenCalledTimes(100);
  queue.dispose();
});
it("departure discards retry work and terminal conflicts never retry", async () => {
  vi.useFakeTimers();
  const fetcher = vi
    .fn()
    .mockResolvedValue(new Response(null, { status: 503 }));
  const queue = new EventQueue(context, fetcher);
  queue.offer("profile-visits", event());
  await vi.advanceTimersByTimeAsync(0);
  queue.dispose();
  await vi.runAllTimersAsync();
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it("only three qualifying cards among twenty produce exposures; hide resets dwell", async () => {
  vi.useFakeTimers();
  const fetcher = vi
    .fn()
    .mockResolvedValue(new Response(null, { status: 201 }));
  const queue = new EventQueue(context, fetcher);
  const cards = Array.from(
    { length: 20 },
    (_, position) =>
      new Impression(
        {
          resultContextId: "page",
          cardId: String(position),
          position,
          expiresAt: Date.now() + 60_000,
        },
        queue,
      ),
  );
  cards.slice(0, 3).forEach((card) => card.visibility(true));
  await vi.advanceTimersByTimeAsync(999);
  expect(fetcher).not.toHaveBeenCalled();
  cards[0].visibility(false);
  await vi.advanceTimersByTimeAsync(1);
  expect(fetcher).toHaveBeenCalledTimes(2);
  cards[0].visibility(true);
  await vi.advanceTimersByTimeAsync(1000);
  expect(fetcher).toHaveBeenCalledTimes(3);
  cards[0].visibility(true);
  await vi.advanceTimersByTimeAsync(1000);
  expect(fetcher).toHaveBeenCalledTimes(3);
});
it("click precedes exposure, distinct clicks share impression, attachment replay does not duplicate exposure", async () => {
  vi.useFakeTimers();
  const fetcher = vi
    .fn()
    .mockResolvedValue(new Response(null, { status: 201 }));
  const queue = new EventQueue(context, fetcher);
  const card = new Impression(
    {
      resultContextId: "page2",
      cardId: "card",
      position: 0,
      expiresAt: Date.now() + 60_000,
    },
    queue,
  );
  card.visibility(true);
  card.click();
  card.click();
  await vi.advanceTimersByTimeAsync(1000);
  card.detach();
  card.visibility(true);
  await vi.advanceTimersByTimeAsync(1000);
  const payloads = fetcher.mock.calls.map((call) => JSON.parse(call[1].body));
  expect(payloads).toHaveLength(3);
  expect(new Set(payloads.map((x) => x.impressionId)).size).toBe(1);
  expect(new Set(payloads.map((x) => x.eventId)).size).toBe(3);
  expect(payloads[2].eventType).toBe("FEED_EXPOSURE");
  expect(payloads[2].position).toBe(0);
});
it("expired events never dispatch and context mismatch invalidates whole queue", async () => {
  const invalidate = vi.fn();
  const fetcher = vi
    .fn()
    .mockResolvedValue(
      Response.json({ code: "BEHAVIOR_CONTEXT_MISMATCH" }, { status: 409 }),
    );
  const queue = new EventQueue(context, fetcher, invalidate);
  queue.offer("profile-visits", event(), Date.now() - 1);
  expect(fetcher).not.toHaveBeenCalled();
  queue.offer("profile-visits", event());
  await vi.waitFor(() => expect(invalidate).toHaveBeenCalledOnce());
  expect(queue.size).toBe(0);
  queue.offer("profile-visits", event());
  expect(fetcher).toHaveBeenCalledOnce();
});
it("refresh cancels old context retries while accepting newly created page events", async () => {
  vi.useFakeTimers();
  const fetcher = vi
    .fn()
    .mockResolvedValue(new Response(null, { status: 503 }));
  const queue = new EventQueue(context, fetcher);
  const old = event();
  queue.offer("profile-visits", old);
  await vi.advanceTimersByTimeAsync(0);
  queue.discardPending();
  fetcher.mockResolvedValue(new Response(null, { status: 201 }));
  queue.offer("profile-visits", event());
  await vi.runAllTimersAsync();
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(queue.size).toBe(0);
});
it("refresh retains in-flight capacity until settlement and never retries discarded requests", async () => {
  vi.useFakeTimers();
  const settle: Array<(response: Response) => void> = [];
  const fetcher = vi.fn(
    () => new Promise<Response>((resolve) => settle.push(resolve)),
  );
  const queue = new EventQueue(context, fetcher);
  for (let i = 0; i < 100; i++) queue.offer("profile-visits", event());
  queue.discardPending();
  queue.offer("profile-visits", event());
  expect(queue.size).toBe(100);
  expect(fetcher).toHaveBeenCalledTimes(100);
  settle.forEach((resolve) => resolve(new Response(null, { status: 503 })));
  await vi.advanceTimersByTimeAsync(0);
  expect(queue.size).toBe(0);
  await vi.runAllTimersAsync();
  expect(fetcher).toHaveBeenCalledTimes(100);
  queue.offer("profile-visits", event());
  expect(fetcher).toHaveBeenCalledTimes(101);
  settle[100](new Response(null, { status: 201 }));
  await vi.runAllTimersAsync();
});
it("a late context-mismatch response from departed work cannot invalidate the replacement session", async () => {
  let resolve!: (response: Response) => void;
  const fetcher = vi.fn(
    () =>
      new Promise<Response>((done) => {
        resolve = done;
      }),
  );
  const invalidate = vi.fn();
  const queue = new EventQueue(context, fetcher, invalidate);
  queue.offer("profile-visits", event());
  queue.dispose();
  resolve(
    Response.json({ code: "BEHAVIOR_CONTEXT_MISMATCH" }, { status: 409 }),
  );
  await vi.waitFor(() => expect(queue.size).toBe(0));
  expect(invalidate).not.toHaveBeenCalled();
});
