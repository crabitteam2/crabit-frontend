import {
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DemoPersonaSelector } from "./demo-persona-selector";
import { PullToRefresh } from "./pull-to-refresh";

const router = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

beforeEach(() => vi.stubGlobal("scrollY", 0));
afterEach(() => vi.unstubAllGlobals());

function renderSelector() {
  render(
    <>
      <DemoPersonaSelector
        available={["grade-3", "grade-4"]}
        selected="grade-3"
      />
      <main data-testid="body">본문</main>
    </>,
  );
  return screen.getByTestId("body");
}

function pull(target: Element, distance = 80, x = 0) {
  fireEvent.touchStart(target, {
    touches: [{ identifier: 1, clientX: 100, clientY: 100 }],
  });
  fireEvent.touchMove(target, {
    touches: [{ identifier: 1, clientX: 100 + x, clientY: 100 + distance }],
  });
  fireEvent.touchEnd(target, { touches: [] });
}

function wheel(target: Element, deltaY: number, timeStamp: number) {
  const event = createEvent.wheel(target, { deltaY });
  Object.defineProperty(event, "timeStamp", { value: timeStamp });
  fireEvent(target, event);
}

it("starts hidden and opens with the keyboard, moving focus to the selector", async () => {
  const user = userEvent.setup();
  renderSelector();
  expect(screen.queryByRole("combobox")).toBeNull();
  expect(screen.getByRole("complementary", { hidden: true })).not.toBeVisible();
  await user.tab();
  expect(screen.getByRole("button", { name: "데모 계정 선택" })).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("combobox", { name: "데모 대표" })).toHaveFocus();
});

it("reveals only for a deliberate vertical pull that starts at the page top", () => {
  const body = renderSelector();
  pull(body, 20);
  pull(body, 80, 120);
  pull(body, -100);
  fireEvent.scroll(window);
  expect(screen.queryByRole("combobox")).toBeNull();
  vi.stubGlobal("scrollY", 200);
  fireEvent.touchStart(body, {
    touches: [{ identifier: 1, clientX: 100, clientY: 100 }],
  });
  vi.stubGlobal("scrollY", 0);
  fireEvent.touchMove(body, {
    touches: [{ identifier: 1, clientX: 100, clientY: 240 }],
  });
  fireEvent.touchEnd(body, { touches: [] });
  expect(screen.queryByRole("combobox")).toBeNull();
  pull(body);
  expect(screen.getByRole("combobox")).toBeVisible();
});

it("ignores multitouch and cancelled gestures", () => {
  const body = renderSelector();
  const point = { identifier: 1, clientX: 100, clientY: 100 };
  fireEvent.touchStart(body, { touches: [point] });
  fireEvent.touchMove(body, { touches: [point, { ...point, identifier: 2 }] });
  fireEvent.touchMove(body, { touches: [{ ...point, clientY: 240 }] });
  expect(screen.queryByRole("combobox")).toBeNull();
  fireEvent.touchStart(body, { touches: [point] });
  fireEvent.touchCancel(body, { touches: [] });
  fireEvent.touchMove(body, { touches: [{ ...point, clientY: 240 }] });
  expect(screen.queryByRole("combobox")).toBeNull();
});

it.each([false, true])(
  "consumes a long reveal gesture without also refreshing the body (diagonal: %s)",
  (diagonal) => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    render(
      <>
        <DemoPersonaSelector
          available={["grade-3", "grade-4"]}
          selected="grade-3"
        />
        <PullToRefresh onRefresh={onRefresh}>
          <main data-testid="body">본문</main>
        </PullToRefresh>
      </>,
    );
    const body = screen.getByTestId("body");
    fireEvent.touchStart(body, {
      touches: [{ identifier: 1, clientX: 100, clientY: 100 }],
    });
    for (const clientY of diagonal ? [250, 300] : [104, 120, 180, 260, 300]) {
      fireEvent.touchMove(body, {
        touches: [{ identifier: 1, clientX: diagonal ? 240 : 100, clientY }],
      });
    }
    fireEvent.touchEnd(body, { touches: [] });
    expect(screen.getByRole("combobox")).toBeVisible();
    expect(onRefresh).not.toHaveBeenCalled();
    expect(screen.queryByRole("status", { name: "새로고침 중" })).toBeNull();
    expect(body.parentElement?.style.transform).toBe("");
  },
);

it("requires a new wheel gesture after reaching the top and accumulates deliberate pull distance", () => {
  const body = renderSelector();
  vi.stubGlobal("scrollY", 200);
  wheel(body, -100, 100);
  vi.stubGlobal("scrollY", 0);
  wheel(body, -100, 150);
  expect(screen.queryByRole("combobox")).toBeNull();
  wheel(body, -30, 500);
  wheel(body, -30, 550);
  expect(screen.queryByRole("combobox")).toBeNull();
  wheel(body, -30, 600);
  expect(screen.getByRole("combobox")).toBeVisible();
});

it("ignores normal scrolling, horizontal wheels, zoom and nested controls", () => {
  const body = renderSelector();
  wheel(body, 120, 100);
  wheel(body, -120, 150);
  fireEvent.wheel(body, { deltaY: -120, deltaX: 200 });
  fireEvent.wheel(body, { deltaY: -120, ctrlKey: true });
  const nested = document.createElement("div");
  nested.style.overflowY = "auto";
  Object.defineProperties(nested, {
    scrollHeight: { value: 300 },
    clientHeight: { value: 100 },
  });
  body.append(nested);
  pull(nested);
  wheel(nested, -120, 1000);
  expect(screen.queryByRole("combobox")).toBeNull();
});

it("closes on body scrolling but keeps native selector interaction open", () => {
  const body = renderSelector();
  pull(body);
  fireEvent.wheel(screen.getByRole("combobox"), { deltaY: 100 });
  expect(screen.getByRole("combobox")).toBeVisible();
  fireEvent.wheel(body, { deltaY: 100 });
  expect(screen.queryByRole("combobox")).toBeNull();
  pull(body);
  pull(body, -40);
  expect(screen.queryByRole("combobox")).toBeNull();
  pull(body);
  vi.stubGlobal("scrollY", 50);
  fireEvent.scroll(window);
  expect(screen.queryByRole("combobox")).toBeNull();
});

it("keeps the pending selection open and prevents duplicate requests", async () => {
  let resolve!: (response: Response) => void;
  const fetcher = vi.fn(
    () =>
      new Promise<Response>((done) => {
        resolve = done;
      }),
  );
  vi.stubGlobal("fetch", fetcher);
  const body = renderSelector();
  pull(body);
  const select = screen.getByRole("combobox");
  fireEvent.change(select, { target: { value: "grade-4" } });
  expect(select).toBeDisabled();
  fireEvent.change(select, { target: { value: "grade-4" } });
  fireEvent.wheel(body, { deltaY: 100 });
  pull(body, -40);
  vi.stubGlobal("scrollY", 50);
  fireEvent.scroll(window);
  expect(screen.getByRole("status")).toBeVisible();
  expect(select).toBeVisible();
  expect(fetcher).toHaveBeenCalledTimes(1);
  resolve(new Response(null, { status: 400 }));
  await waitFor(() => expect(screen.getByRole("alert")).toBeVisible());
  expect(select).toBeVisible();
  expect(select).not.toBeDisabled();
});

it("shows only configured aliases and reports selection failure without losing the current identity", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValue(new Response(null, { status: 400 }));
  vi.stubGlobal("fetch", fetcher);
  const body = renderSelector();
  pull(body);
  const select = screen.getByRole("combobox", { name: "데모 대표" });
  expect(screen.queryByRole("option", { name: /6학년/ })).toBeNull();
  fireEvent.change(select, { target: { value: "grade-4" } });
  await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  expect(fetcher).toHaveBeenCalledWith(
    "/api/demo/persona",
    expect.objectContaining({
      body: JSON.stringify({ persona: "grade-4" }),
      credentials: "same-origin",
    }),
  );
  expect(select).toHaveValue("grade-3");
  expect(select).not.toBeDisabled();
});
