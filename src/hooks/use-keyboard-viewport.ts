"use client";

import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (!isKeyboardOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isKeyboardOpen]);

  return box;
}
