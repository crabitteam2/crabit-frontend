"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import coinImage from "@/../public/images/wishes/coin.png";

import {
  ALIGNED,
  BANK,
  COIN,
  COIN_INK,
  LANDED,
  fallPose,
} from "./coin-drop-geometry";

import { PiggyBankCharacter } from "./piggy-bank-character";

const HOME = { x: COIN.left, y: COIN.top };
const ALIGN_MS = 300;
const HOLD_MS = 100;
const FALL_MS = 500;
const RETURN_MS = 200;

type Phase =
  | "idle"
  | "dragging"
  | "returning"
  | "aligning"
  | "holding"
  | "falling"
  | "landed";
interface Point {
  x: number;
  y: number;
}
interface CoinDropProps {
  onDrop: () => void;
  disabled?: boolean;
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function interpolate(from: Point, to: Point, t: number): Point {
  return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
}

export function CoinDrop({ onDrop, disabled = false }: CoinDropProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<number | null>(null);
  const grabOffset = useRef<Point>({ x: 0, y: 0 });
  const position = useRef<Point>(HOME);
  const locked = useRef(false);
  const frame = useRef<number | null>(null);
  const [point, setPoint] = useState<Point>(HOME);
  const [fallProgress, setFallProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const move = (next: Point) => {
    position.current = next;
    setPoint(next);
  };

  const animate = (from: Point, accepted: boolean) => {
    locked.current = true;
    if (reducedMotion()) {
      move(accepted ? LANDED : HOME);
      setFallProgress(accepted ? 1 : 0);
      setPhase(accepted ? "landed" : "idle");
      if (accepted) onDropRef.current();
      else locked.current = false;
      return;
    }
    setPhase(accepted ? "aligning" : "returning");
    const started = performance.now();
    // A quadratic path bends upward before easing into the centered hold.
    const control = { x: from.x, y: Math.min(from.y, ALIGNED.y) - 48 };
    const tick = (now: number) => {
      const elapsed = now - started;
      if (!accepted) {
        const t = Math.min(elapsed / RETURN_MS, 1);
        move(interpolate(from, HOME, 1 - (1 - t) ** 3));
        if (t === 1) {
          locked.current = false;
          setPhase("idle");
          frame.current = null;
          return;
        }
      } else if (elapsed < ALIGN_MS) {
        const t = 1 - (1 - elapsed / ALIGN_MS) ** 2;
        move(
          interpolate(
            interpolate(from, control, t),
            interpolate(control, ALIGNED, t),
            t,
          ),
        );
      } else if (elapsed < ALIGN_MS + HOLD_MS) {
        move(ALIGNED);
        setPhase("holding");
      } else {
        const t = Math.min((elapsed - ALIGN_MS - HOLD_MS) / FALL_MS, 1);
        const pose = fallPose(t);
        move({ x: pose.x, y: pose.y });
        setFallProgress(t);
        setPhase(t === 1 ? "landed" : "falling");
        if (t === 1) {
          frame.current = null;
          onDropRef.current();
          return;
        }
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  const toAreaPoint = (event: React.PointerEvent) => {
    const rect = areaRef.current?.getBoundingClientRect();
    return rect
      ? { x: event.clientX - rect.left, y: event.clientY - rect.top }
      : null;
  };
  const draggedPoint = (event: React.PointerEvent) => {
    const next = toAreaPoint(event);
    return next
      ? { x: next.x - grabOffset.current.x, y: next.y - grabOffset.current.y }
      : position.current;
  };
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      disabled ||
      locked.current ||
      pointer.current !== null ||
      event.button !== 0
    )
      return;
    const next = toAreaPoint(event);
    if (!next) return;
    pointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    grabOffset.current = {
      x: next.x - position.current.x,
      y: next.y - position.current.y,
    };
    setPhase("dragging");
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointer.current !== event.pointerId) return;
    move(draggedPoint(event));
  };
  const finish = (
    event: React.PointerEvent<HTMLDivElement>,
    cancelled: boolean,
  ) => {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    const released = cancelled ? position.current : draggedPoint(event);
    move(released);
    const centerX = released.x + COIN.size / 2;
    const centerY = released.y + COIN.size / 2;
    const accepted =
      !cancelled &&
      !disabled &&
      centerX >= BANK.left &&
      centerX <= BANK.left + BANK.width &&
      centerY >= BANK.top &&
      centerY <= BANK.top + BANK.height;
    animate(released, accepted);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const isAccepted = ["aligning", "holding", "falling", "landed"].includes(
    phase,
  );
  const pose = fallPose(fallProgress);
  const unavailable = disabled || (phase !== "idle" && phase !== "dragging");

  return (
    <div ref={areaRef} className="absolute inset-0">
      <PiggyBankCharacter expression={isAccepted ? "smile" : "normal"} />
      <div
        role="button"
        tabIndex={unavailable ? -1 : 0}
        aria-label="동전을 저금통으로 끌어 넣기"
        aria-disabled={unavailable}
        data-phase={phase}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => finish(event, false)}
        onPointerCancel={(event) => finish(event, true)}
        onLostPointerCapture={(event) => finish(event, true)}
        className={`absolute touch-none select-none ${phase === "dragging" ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          left: 0,
          top: 0,
          width: COIN.size,
          height: COIN.size,
          transform: `translate(${point.x}px, ${point.y}px)`,
        }}
      >
        <div
          data-coin-art="true"
          className="size-full"
          style={{
            transformOrigin: `${COIN_INK.centerX}px ${COIN_INK.centerY}px`,
            transform: `rotate(${pose.rotation}deg) rotateY(${pose.turn}deg) scale(${pose.scale})`,
          }}
        >
          <Image
            src={coinImage}
            alt=""
            width={COIN.size}
            sizes={`${COIN.size}px`}
            height={COIN.size}
            priority
            draggable={false}
            className="pointer-events-none size-full"
          />
        </div>
      </div>
      {phase === "falling" || phase === "landed" ? (
        <PiggyBankCharacter expression="smile" foreground />
      ) : null}
    </div>
  );
}
