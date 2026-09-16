import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CoinDrop } from "./coin-drop";
import { ALIGNED, LANDED } from "./coin-drop-geometry";

vi.mock("next/image", () => ({ default: () => <span /> }));
let now = 0;
let callback: FrameRequestCallback | null;
beforeEach(() => {
  now = 0;
  callback = null;
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    callback = cb;
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {
    callback = null;
  });
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  vi.stubGlobal(
    "PointerEvent",
    class extends MouseEvent {
      pointerId: number;
      constructor(type: string, init: PointerEventInit) {
        super(type, init);
        this.pointerId = init.pointerId ?? 1;
      }
    },
  );
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.hasPointerCapture = () => true;
  HTMLElement.prototype.releasePointerCapture = vi.fn();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function advance(ms: number) {
  now += ms;
  act(() => {
    const cb = callback;
    callback = null;
    cb?.(now);
  });
}
function down(coin: HTMLElement, id = 1, x = 67, y = 287) {
  fireEvent.pointerDown(coin, {
    pointerId: id,
    button: 0,
    clientX: x,
    clientY: y,
  });
}
function release(coin: HTMLElement, x: number, y: number, id = 1) {
  fireEvent.pointerUp(coin, { pointerId: id, clientX: x, clientY: y });
}

describe("coin drop", () => {
  it.each([
    [92, 310],
    [299, 310],
    [92, 587],
    [299, 587],
    [196, 440],
  ])(
    "accepts inclusive bank center %s,%s from the actual release, with one continuous 900ms coin",
    (x, y) => {
      const drop = vi.fn();
      render(<CoinDrop onDrop={drop} />);
      const coin = screen.getByRole("button");
      down(coin);
      release(coin, x, y);
      expect(coin.style.transform).toBe(`translate(${x - 72}px, ${y - 72}px)`);
      expect(coin).toHaveAttribute("data-phase", "aligning");
      expect(
        coin.parentElement?.querySelector('[data-piggy-bank="foreground"]'),
      ).toBeNull();
      advance(150);
      expect(coin.style.transform).not.toBe(
        `translate(${x - 72}px, ${y - 72}px)`,
      );
      advance(150);
      expect(coin.style.transform).toBe(
        `translate(${ALIGNED.x}px, ${ALIGNED.y}px)`,
      );
      expect(coin).toHaveAttribute("data-phase", "holding");
      const artwork = coin.querySelector<HTMLElement>("[data-coin-art]")!;
      expect(artwork.style.transform).toBe(
        "rotate(0deg) rotateY(0deg) scale(1)",
      );
      advance(99);
      expect(coin.style.transform).toBe(
        `translate(${ALIGNED.x}px, ${ALIGNED.y}px)`,
      );
      advance(1);
      expect(coin).toHaveAttribute("data-phase", "falling");
      expect(
        coin.parentElement?.querySelector('[data-piggy-bank="foreground"]'),
      ).not.toBeNull();
      expect(artwork.style.transform).toBe(
        "rotate(0deg) rotateY(0deg) scale(1)",
      );
      advance(250);
      expect(artwork.style.transform).not.toBe(
        "rotate(0deg) rotateY(0deg) scale(1)",
      );
      advance(249);
      expect(drop).not.toHaveBeenCalled();
      advance(1);
      expect(coin.style.transform).toBe(
        `translate(${LANDED.x}px, ${LANDED.y}px)`,
      );
      expect(screen.getByRole("button")).toBe(coin);
      expect(drop).toHaveBeenCalledTimes(1);
      down(coin);
      release(coin, 196, 440);
      advance(1000);
      expect(drop).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    [91, 440],
    [300, 440],
    [196, 309],
    [196, 588],
  ])("returns invalid center %s,%s in 200ms then allows retry", (x, y) => {
    const drop = vi.fn();
    render(<CoinDrop onDrop={drop} />);
    const coin = screen.getByRole("button");
    down(coin);
    release(coin, x, y);
    expect(coin).toHaveAttribute("data-phase", "returning");
    advance(199);
    expect(coin).toHaveAttribute("aria-disabled", "true");
    advance(1);
    expect(coin.style.transform).toBe("translate(-5px, 215px)");
    down(coin);
    release(coin, 196, 440);
    advance(900);
    expect(drop).toHaveBeenCalledTimes(1);
  });

  it("uses grab offset, ignores other pointers and rejects cancellation", () => {
    const drop = vi.fn();
    render(<CoinDrop onDrop={drop} />);
    const coin = screen.getByRole("button");
    down(coin, 1, 0, 220);
    down(coin, 2);
    release(coin, 196, 440, 2);
    expect(coin).toHaveAttribute("data-phase", "dragging");
    fireEvent.pointerMove(coin, { pointerId: 1, clientX: 150, clientY: 400 });
    fireEvent.pointerCancel(coin, { pointerId: 1 });
    advance(200);
    expect(drop).not.toHaveBeenCalled();
    down(coin, 1, 0, 220);
    release(coin, 25, 243);
    expect(coin).toHaveAttribute("data-phase", "aligning"); // center is 92,310 despite pointer being outside
    advance(900);
    expect(drop).toHaveBeenCalledTimes(1);
  });

  it("cancels scheduled funding on unmount", () => {
    const drop = vi.fn();
    const view = render(<CoinDrop onDrop={drop} />);
    const coin = screen.getByRole("button");
    down(coin);
    release(coin, 196, 440);
    advance(350);
    view.unmount();
    advance(1000);
    expect(drop).not.toHaveBeenCalled();
  });
  it("locks synchronously even for reduced motion and repeated same-turn input", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const drop = vi.fn();
    render(<CoinDrop onDrop={drop} />);
    const coin = screen.getByRole("button");
    act(() => {
      down(coin);
      release(coin, 196, 440);
      down(coin);
      release(coin, 196, 440);
    });
    expect(drop).toHaveBeenCalledTimes(1);
  });
  it("does not start a gesture while disabled", () => {
    const drop = vi.fn();
    render(<CoinDrop onDrop={drop} disabled />);
    const coin = screen.getByRole("button");
    down(coin);
    release(coin, 196, 440);
    advance(900);
    expect(drop).not.toHaveBeenCalled();
    expect(coin).toHaveAttribute("data-phase", "idle");
  });
});
