import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FeedScreen } from "./feed-screen";
import { BehaviorReadError } from "./behavior-session";
import type { FeedPage } from "./feed-pagination";

const mocks = vi.hoisted(() => ({
  read: vi.fn(),
  session: null as any,
  cards: [] as any[],
  impressions: [] as any[],
}));
vi.mock("./behavior-session", async (original) => ({
  ...(await original<any>()),
  behaviorRead: mocks.read,
  useBehaviorSession: () => mocks.session,
}));
vi.mock("@/app/_components/pull-to-refresh", () => ({
  PullToRefresh: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/app/wishes/_components/top-button", () => ({
  TopButton: () => null,
}));
vi.mock("./empty-feed", () => ({
  EmptyFeed: () => <p>학원 피드에 표시될 위시가 없어요.</p>,
}));
vi.mock("@/app/_components/error-screen", () => ({
  ErrorScreen: ({ message, reset }: any) => (
    <>
      <p role="alert">{message}</p>
      {reset && <button onClick={reset}>다시 시도</button>}
    </>
  ),
}));
vi.mock("./feed-skeleton", () => ({ FeedSkeleton: () => <p>Skeleton</p> }));
vi.mock("./feed-header", () => ({
  FeedHeader: ({ sortLabel }: any) => <header>{sortLabel}</header>,
}));
vi.mock("./feed-card", () => ({
  FeedCard: (props: any) => {
    mocks.cards.push(props);
    return <article>{props.card.purpose}</article>;
  },
}));
vi.mock("@/lib/behavior/collector", () => ({
  Impression: class {
    end = vi.fn();
    constructor(
      public identity: any,
      public queue: any,
    ) {
      mocks.impressions.push(this);
    }
  },
}));

const observers: { callback: IntersectionObserverCallback; active: boolean }[] =
  [];
function intersect() {
  for (const observer of [...observers])
    if (observer.active)
      observer.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
}
function session(id = "one") {
  return {
    context: { contextId: id, academyId: id },
    entry: { queue: { discardPending: vi.fn() } },
    accounts: [],
    selectAcademy: vi.fn(),
  };
}
function page(
  ids: string[],
  nextCursor: string | null = null,
  resultContextId = "context-one",
): FeedPage {
  return {
    resultContextId,
    nextCursor,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    sortSource: "LATEST",
    recommendationResultId: null,
    modelVersion: null,
    items: ids.map((id) => ({
      sharedCardId: id,
      ownerId: id,
      ownerNickname: id,
      kind: "PROGRESS",
      purpose: id,
      targetAmount: 100,
      progressPercent: 10,
      photo: null,
      startDate: null,
      targetDate: null,
      balanceAdjustmentInProgress: false,
      contentUpdatedAt: new Date().toISOString(),
    })),
  } as FeedPage;
}
function deferred() {
  let resolve!: (value: FeedPage) => void;
  const promise = new Promise<FeedPage>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
beforeEach(() => {
  mocks.read.mockReset();
  mocks.cards.length = 0;
  mocks.impressions.length = 0;
  mocks.session = session();
  observers.length = 0;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      item: any;
      constructor(callback: IntersectionObserverCallback) {
        this.item = { callback, active: true };
        observers.push(this.item);
      }
      observe() {}
      disconnect() {
        this.item.active = false;
      }
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("feed pagination", () => {
  it("loads ten, serializes repeated intersections, preserves first identity before dedup and stops at end", async () => {
    const pending = deferred();
    mocks.read
      .mockResolvedValueOnce(page(["a"], "next"))
      .mockReturnValueOnce(pending.promise);
    render(<FeedScreen />);
    await screen.findByText("a");
    const original = mocks.impressions[0];
    await waitFor(() =>
      expect(observers.some((item) => item.active)).toBe(true),
    );
    await act(async () => {
      intersect();
      intersect();
      intersect();
    });
    expect(mocks.read).toHaveBeenCalledTimes(2);
    expect(JSON.parse(mocks.read.mock.calls[0][2].body)).toEqual({ limit: 10 });
    expect(JSON.parse(mocks.read.mock.calls[1][2].body)).toEqual({
      limit: 10,
      cursor: "next",
    });
    await act(async () =>
      pending.resolve(page(["a", "b"], null, "context-two")),
    );
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(mocks.impressions).toHaveLength(2);
    await act(async () =>
      observers[0].callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(mocks.read).toHaveBeenCalledTimes(2);
    expect(mocks.impressions[1].identity).toMatchObject({
      resultContextId: "context-two",
      cardId: "b",
      position: 1,
    });
    expect(original.end).not.toHaveBeenCalled();
    expect(mocks.session.entry.queue.discardPending).toHaveBeenCalledTimes(1);
    await act(async () => intersect());
    expect(mocks.read).toHaveBeenCalledTimes(2);
    expect(screen.getByText("모든 피드를 확인했어요.")).toBeInTheDocument();
  });
  it("keeps existing DOM and retries only the failed cursor after a 503 without observer retries", async () => {
    mocks.read
      .mockResolvedValueOnce(page(["a"], "retry-cursor"))
      .mockRejectedValueOnce(
        new BehaviorReadError(503, "PHOTO_DELIVERY_UNAVAILABLE"),
      )
      .mockResolvedValueOnce(page(["b"]));
    render(<FeedScreen />);
    await screen.findByText("a");
    const article = screen.getByRole("article");
    await act(async () => intersect());
    await screen.findByRole("alert");
    await act(async () =>
      observers[0].callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    await act(async () => intersect());
    expect(mocks.read).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("article")).toBe(article);
    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
    await screen.findByText("b");
    expect(mocks.read.mock.calls[2][2].body).toBe(
      mocks.read.mock.calls[1][2].body,
    );
  });
  it.each([
    new BehaviorReadError(410),
    new BehaviorReadError(400, "RECOMMENDATION_CURSOR_EXPIRED"),
  ])("requires explicit restart after expired cursor", async (error) => {
    mocks.read
      .mockResolvedValueOnce(page(["a"], "expired"))
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(page(["fresh"]));
    render(<FeedScreen />);
    await screen.findByText("a");
    await act(async () => intersect());
    await screen.findByRole("button", { name: "목록 새로 시작" });
    expect(screen.queryByRole("button", { name: "다시 시도" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "목록 새로 시작" }));
    await screen.findByText("fresh");
    expect(JSON.parse(mocks.read.mock.calls[2][2].body)).toEqual({ limit: 10 });
    expect(screen.queryByText("a")).toBeNull();
  });
  it.each([401, 403])(
    "halts auth failure %s without automatic retry",
    async (status) => {
      mocks.read
        .mockResolvedValueOnce(page(["a"], "next"))
        .mockRejectedValueOnce(new BehaviorReadError(status));
      render(<FeedScreen />);
      await screen.findByText("a");
      await act(async () => intersect());
      await screen.findByRole("alert");
      await act(async () => intersect());
      expect(mocks.read).toHaveBeenCalledTimes(2);
      expect(screen.queryByRole("button", { name: "다시 시도" })).toBeNull();
    },
  );
  it("halts a cycle even across empty pages", async () => {
    mocks.read
      .mockResolvedValueOnce(page(["a"], "A"))
      .mockResolvedValueOnce(page([], "B"))
      .mockResolvedValueOnce(page([], "A"));
    render(<FeedScreen />);
    await screen.findByText("a");
    await act(async () => intersect());
    await act(async () => intersect());
    await screen.findByRole("button", { name: "목록 새로 시작" });
    await act(async () => intersect());
    expect(mocks.read).toHaveBeenCalledTimes(3);
  });
  it("discards an old page after refresh and aborts it", async () => {
    const pending = deferred();
    mocks.read
      .mockResolvedValueOnce(page(["a"], "next"))
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValueOnce(page(["fresh"]));
    render(<FeedScreen />);
    await screen.findByText("a");
    await act(async () => intersect());
    fireEvent.click(screen.getByRole("button", { name: "새로고침" }));
    await screen.findByText("fresh");
    expect(mocks.read.mock.calls[1][2].signal.aborted).toBe(true);
    await act(async () => pending.resolve(page(["stale"])));
    expect(screen.queryByText("stale")).toBeNull();
  });
  it("does not show the old academy while a new generation is loading, including A-B-A", async () => {
    const old = deferred(),
      next = deferred();
    mocks.read
      .mockReturnValueOnce(old.promise)
      .mockReturnValueOnce(next.promise)
      .mockResolvedValueOnce(page(["new-A"]));
    const view = render(<FeedScreen />);
    mocks.session = session("B");
    view.rerender(<FeedScreen />);
    await act(async () => old.resolve(page(["stale-A"])));
    expect(screen.queryByText("stale-A")).toBeNull();
    mocks.session = session("A-new");
    view.rerender(<FeedScreen />);
    await screen.findByText("new-A");
    await act(async () => next.resolve(page(["stale-B"])));
    expect(screen.queryByText("stale-B")).toBeNull();
  });
  it("aborts unmount and exposes initial error retry", async () => {
    mocks.read
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(page([]));
    const view = render(<FeedScreen />);
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
    await waitFor(() =>
      expect(
        screen.getByText("학원 피드에 표시될 위시가 없어요."),
      ).toBeInTheDocument(),
    );
    view.unmount();
    expect(mocks.read.mock.calls[1][2].signal.aborted).toBe(true);
  });
});
