import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useBodyScrollLock } from "./use-body-scroll-lock";

afterEach(() => {
  document.body.style.overflow = "";
});

describe("body scroll lock", () => {
  it("locks while open and restores the earlier value", () => {
    document.body.style.overflow = "auto";

    const { unmount } = renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("does nothing while closed", () => {
    document.body.style.overflow = "auto";

    const { unmount } = renderHook(() => useBodyScrollLock(false));
    expect(document.body.style.overflow).toBe("auto");

    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("keeps the lock until the last holder releases it", () => {
    document.body.style.overflow = "auto";

    const first = renderHook(() => useBodyScrollLock(true));
    const second = renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");

    first.unmount();
    expect(document.body.style.overflow).toBe("hidden");

    second.unmount();
    expect(document.body.style.overflow).toBe("auto");
  });
});
