"use client";

import { useEffect, useRef, useState } from "react";
import { useBodyScrollLock } from "./use-body-scroll-lock";

const KEYBOARD_THRESHOLD = 120;

export interface KeyboardViewport {
  height: number;
  offsetTop: number;
  isKeyboardOpen: boolean;
}

export function useKeyboardViewport(): KeyboardViewport | null {
  const [box, setBox] = useState<KeyboardViewport | null>(null);
  const tallest = useRef(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (viewport == null) return;

    const sync = () => {
      tallest.current = Math.max(tallest.current, viewport.height);
      setBox({
        height: viewport.height,
        offsetTop: viewport.offsetTop,
        isKeyboardOpen: tallest.current - viewport.height > KEYBOARD_THRESHOLD,
      });
    };

    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
    };
  }, []);

  const isKeyboardOpen = box?.isKeyboardOpen ?? false;

  useBodyScrollLock(isKeyboardOpen);

  useEffect(() => {
    if (!isKeyboardOpen) return;
    window.scrollTo(0, 0);
  }, [isKeyboardOpen]);

  return box;
}
