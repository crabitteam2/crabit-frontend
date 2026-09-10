import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useKeyboardViewport } from "./use-keyboard-viewport";

const originalViewport = Object.getOwnPropertyDescriptor(
  window,
  "visualViewport",
);
afterEach(() => {
  if (originalViewport)
    Object.defineProperty(window, "visualViewport", originalViewport);
  else Reflect.deleteProperty(window, "visualViewport");
  document.body.style.overflow = "";
  vi.restoreAllMocks();
});

describe("keyboard viewport", () => {
  it.each([null, undefined])(
    "supports a missing visualViewport (%s)",
    (value) => {
      Object.defineProperty(window, "visualViewport", {
        configurable: true,
        value,
      });
      const { result, unmount } = renderHook(useKeyboardViewport);
      expect(result.current).toBeNull();
      unmount();
    },
  );

  it("tracks keyboard geometry and restores body overflow and listeners on unmount", () => {
    const viewport = new EventTarget() as EventTarget & {
      height: number;
      offsetTop: number;
    };
    viewport.height = 844;
    viewport.offsetTop = 0;
    const remove = vi.spyOn(viewport, "removeEventListener");
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: viewport,
    });
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    document.body.style.overflow = "auto";
    const { result, unmount } = renderHook(useKeyboardViewport);
    expect(result.current?.isKeyboardOpen).toBe(false);
    act(() => {
      viewport.height = 500;
      viewport.offsetTop = 25;
      viewport.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toEqual({
      height: 500,
      offsetTop: 25,
      isKeyboardOpen: true,
    });
    expect(document.body.style.overflow).toBe("hidden");
    act(() => {
      viewport.height = 844;
      viewport.dispatchEvent(new Event("resize"));
    });
    expect(document.body.style.overflow).toBe("auto");
    act(() => {
      viewport.height = 500;
      viewport.dispatchEvent(new Event("scroll"));
    });
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("auto");
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
