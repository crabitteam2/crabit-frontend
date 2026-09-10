"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const PULL_THRESHOLD = 64;
const MAX_PULL = 96;
const RESISTANCE = 0.5;
const MIN_SPIN_MS = 600;
const AXIS_LOCK = 8;

interface PullToRefreshProps {
  children: ReactNode;
  /** 화면을 다시 그리기 전에 실행할 서버 요청입니다. */
  onRefresh?: () => Promise<unknown>;
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const startX = useRef(0);
  const axis = useRef<"x" | "y" | null>(null);
  const offsetRef = useRef(0);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const setPull = useCallback((next: number) => {
    offsetRef.current = next;
    setOffset(next);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    const start = (event: TouchEvent) => {
      startY.current = null;
      axis.current = null;
      if (refreshingRef.current || window.scrollY > 0) return;
      if (event.touches.length > 1) return;
      if (document.querySelector('[aria-modal="true"]') !== null) return;
      if (document.activeElement?.tagName === "INPUT") return;

      const touch = event.touches[0];
      if (touch === undefined) return;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
    };

    const move = (event: TouchEvent) => {
      if (startY.current === null) return;

      if (event.touches.length > 1) {
        startY.current = null;
        setIsDragging(false);
        setPull(0);
        return;
      }

      const touch = event.touches[0];
      const deltaX = (touch?.clientX ?? 0) - startX.current;
      const deltaY = (touch?.clientY ?? 0) - startY.current;

      if (axis.current === null) {
        if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < AXIS_LOCK) return;
        axis.current = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
      }

      if (axis.current === "x" || deltaY <= 0) {
        setIsDragging(false);
        setPull(0);
        return;
      }

      setIsDragging(true);
      setPull(Math.min(MAX_PULL, deltaY * RESISTANCE));
    };

    const end = () => {
      if (startY.current === null) return;

      startY.current = null;
      axis.current = null;
      setIsDragging(false);
      if (offsetRef.current < PULL_THRESHOLD) {
        setPull(0);
        return;
      }

      refreshingRef.current = true;
      setIsRefreshing(true);
      setPull(PULL_THRESHOLD);

      const request = onRefreshRef.current?.() ?? Promise.resolve();
      const spin = new Promise((resolve) =>
        window.setTimeout(resolve, MIN_SPIN_MS),
      );

      void request
        .catch(() => undefined)
        .then(() => {
          router.refresh();
          return spin;
        })
        .then(() => {
          refreshingRef.current = false;
          setIsRefreshing(false);
          setPull(0);
        });
    };

    container.addEventListener("touchstart", start, { passive: true });
    container.addEventListener("touchmove", move, { passive: true });
    container.addEventListener("touchend", end);
    container.addEventListener("touchcancel", end);

    return () => {
      container.removeEventListener("touchstart", start);
      container.removeEventListener("touchmove", move);
      container.removeEventListener("touchend", end);
      container.removeEventListener("touchcancel", end);
    };
  }, [router, setPull]);

  const easing = isDragging
    ? ""
    : "transition-all duration-200 motion-reduce:transition-none";

  return (
    <div ref={containerRef} className="relative flex flex-col">
      <div
        aria-hidden={offset === 0}
        className={`pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center overflow-hidden ${easing}`}
        style={{ height: offset, opacity: offset === 0 ? 0 : 1 }}
      >
        <span
          role={isRefreshing ? "status" : undefined}
          aria-label={isRefreshing ? "새로고침 중" : undefined}
          className={`border-stroke-brand block size-6 rounded-full border-[3px] border-t-transparent ${
            isRefreshing ? "animate-spin" : ""
          }`}
          style={
            isRefreshing ? undefined : { transform: `rotate(${offset * 4}deg)` }
          }
        />
      </div>

      <div
        className={`flex flex-col ${easing}`}
        style={
          offset === 0 ? undefined : { transform: `translateY(${offset}px)` }
        }
      >
        {children}
      </div>
    </div>
  );
}
