"use client";

import Link from "next/link";

import { useEffect, useId, useRef, useState } from "react";
import type { DemoGradePersona, Persona } from "@/lib/persona/persona";
import { Spinner } from "@/components/ui/spinner";

const PULL_DISTANCE = 64;
const WHEEL_DISTANCE = 80;
const WHEEL_GESTURE_GAP = 180;

/** Server supplies aliases only; credentials never cross the component boundary. */
export function DemoPersonaSelector({
  available,
  selected,
}: {
  available: readonly DemoGradePersona[];
  selected: Persona | null;
}) {
  const panelId = useId();
  const panel = useRef<HTMLElement>(null);
  const selector = useRef<HTMLSelectElement>(null);
  const focusOnOpen = useRef(false);
  const consumingPull = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const switching = useRef(false);
  useEffect(() => {
    if (expanded && focusOnOpen.current) {
      focusOnOpen.current = false;
      const target = available.length > 0 ? selector.current : panel.current;
      target?.focus();
    }
  }, [expanded, available.length]);
  useEffect(() => {
    let touch: { id: number; x: number; y: number } | null = null;
    let wheelLastAt = -Infinity;
    let wheelDistance = 0;
    let wheelStartedAtTop = false;

    const atTop = () => window.scrollY <= 0;
    const inSelector = (target: EventTarget | null) =>
      target instanceof Node && panel.current?.contains(target);
    const inNestedControl = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      if (
        target.closest(
          "input, textarea, select, [contenteditable], [role=dialog]",
        )
      ) {
        return true;
      }
      for (
        let element: Element | null = target;
        element &&
        element !== document.body &&
        element !== document.documentElement;
        element = element.parentElement
      ) {
        if (
          /auto|scroll/.test(getComputedStyle(element).overflowY) &&
          element.scrollHeight > element.clientHeight
        )
          return true;
      }
      return false;
    };
    const touchStart = (event: TouchEvent) => {
      touch = null;
      consumingPull.current = false;
      if (
        event.touches.length !== 1 ||
        inSelector(event.target) ||
        inNestedControl(event.target) ||
        (!expanded && !atTop())
      )
        return;
      const point = event.touches[0];
      touch = { id: point.identifier, x: point.clientX, y: point.clientY };
    };
    const touchMove = (event: TouchEvent) => {
      // Keep ownership through the end of the gesture, even after opening
      // re-renders this component, so PullToRefresh cannot consume the same pull.
      if (consumingPull.current) {
        event.stopPropagation();
        if (event.cancelable) event.preventDefault();
      }
      const point = event.touches[0];
      if (
        !touch ||
        event.touches.length !== 1 ||
        point.identifier !== touch.id
      ) {
        touch = null;
        return;
      }
      const dx = Math.abs(point.clientX - touch.x);
      const dy = point.clientY - touch.y;
      if (dx > 16 && dx > Math.abs(dy)) {
        touch = null;
        return;
      }
      if (expanded) {
        if (dy < -8 && !switching.current) setExpanded(false);
        return;
      }
      if (!atTop() || dy < -8) {
        touch = null;
        return;
      }
      if (dy > 8 && dy >= dx) {
        consumingPull.current = true;
        event.stopPropagation();
        if (event.cancelable) event.preventDefault();
      }
      if (dy >= PULL_DISTANCE && dy > dx * 1.25) {
        touch = null;
        setExpanded(true);
      }
    };
    const touchEnd = () => {
      touch = null;
      consumingPull.current = false;
    };
    const wheel = (event: WheelEvent) => {
      // A gesture that merely reaches the top must not reveal the selector.
      if (event.timeStamp - wheelLastAt > WHEEL_GESTURE_GAP) {
        wheelDistance = 0;
        wheelStartedAtTop = atTop();
      }
      wheelLastAt = event.timeStamp;
      if (
        event.ctrlKey ||
        inSelector(event.target) ||
        inNestedControl(event.target) ||
        Math.abs(event.deltaX) >= Math.abs(event.deltaY)
      ) {
        wheelStartedAtTop = false;
        return;
      }
      if (expanded) {
        if (event.deltaY > 0 && !switching.current) setExpanded(false);
        return;
      }
      if (!atTop() || event.deltaY >= 0) {
        wheelStartedAtTop = false;
        return;
      }
      if (!wheelStartedAtTop) return;
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;
      wheelDistance += -event.deltaY * unit;
      if (wheelDistance >= WHEEL_DISTANCE) {
        wheelStartedAtTop = false;
        setExpanded(true);
      }
    };
    const scroll = () => {
      // Preserve native select interaction and pending requests. Layout/focus
      // changes alone never reveal the panel.
      if (
        expanded &&
        window.scrollY > 0 &&
        !switching.current &&
        !inSelector(document.activeElement)
      )
        setExpanded(false);
    };
    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchmove", touchMove, {
      passive: false,
      capture: true,
    });
    window.addEventListener("touchend", touchEnd);
    window.addEventListener("touchcancel", touchEnd);
    window.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove, true);
      window.removeEventListener("touchend", touchEnd);
      window.removeEventListener("touchcancel", touchEnd);
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("scroll", scroll);
    };
  }, [expanded]);
  useEffect(() => {
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);
  async function select(persona: string) {
    if (switching.current) return;
    switching.current = true;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/demo/persona", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona }),
      });
      if (!response.ok) throw new Error("selection failed");
      setExpanded(false);
      window.location.replace("/demo");
    } catch {
      setError("대표를 변경하지 못했어요. 다시 시도해 주세요.");
      switching.current = false;
      setPending(false);
    }
  }
  return (
    <>
      <button
        type="button"
        hidden={expanded}
        aria-controls={panelId}
        aria-expanded={expanded}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:outline-2 focus:outline-offset-2"
        onClick={() => {
          focusOnOpen.current = true;
          setExpanded(true);
        }}
      >
        데모 계정 선택
      </button>
      <aside
        ref={panel}
        id={panelId}
        tabIndex={-1}
        hidden={!expanded}
        className="border-b border-gray-200 bg-white px-4 py-3"
        aria-label="데모 대표 선택"
      >
        <label className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          데모 대표
          <select
            ref={selector}
            aria-label="데모 대표"
            value={selected ?? ""}
            disabled={pending || available.length === 0}
            onChange={(event) => void select(event.target.value)}
            className="min-h-11 max-w-full rounded-lg border border-gray-300 px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {!available.includes(selected as DemoGradePersona) && (
              <option value={selected ?? ""} disabled>
                {selected === "owner" ? "기본 Owner" : "대표를 선택해 주세요"}
              </option>
            )}
            {available.map((persona) => (
              <option key={persona} value={persona}>
                {persona.slice(-1)}학년 대표 · {persona}
              </option>
            ))}
          </select>
          <Link prefetch={false} className="underline" href="/demo">
            대표 정보
          </Link>
        </label>
        {available.length === 0 && (
          <p className="mt-2 text-sm">대표 계정이 아직 준비되지 않았어요.</p>
        )}
        {pending && (
          <Spinner
            tone="brand"
            className="mt-2 size-4"
            label="대표를 변경하는 중"
          />
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm">
            {error}
          </p>
        )}
      </aside>
    </>
  );
}
