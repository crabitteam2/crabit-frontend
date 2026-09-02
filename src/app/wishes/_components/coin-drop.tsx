"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import coinImage from "@/../public/images/wishes/coin.png";
import piggyBankSmileImage from "@/../public/images/wishes/piggy-bank-smile.png";
import piggyBankImage from "@/../public/images/wishes/piggy-bank.png";

const COIN = { left: -5, top: 215, size: 144 };
const BANK = { left: 92, top: 310, width: 207, height: 277 };

/** 저금통 그림에서 앞으로 겹쳐 그릴 아랫부분이 시작하는 높이입니다. */
const FRONT_TOP = 428;

/** 떨어지는 동전이 멈추는 자리입니다. 앞조각에 완전히 가려집니다. */
const FALLING_COIN = { left: 124, top: 435, size: COIN.size };

const FALL_MS = 1000;

const SETTLE_MS = 250;

interface Point {
  x: number;
  y: number;
}

interface CoinDropProps {
  onDrop: () => void;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CoinDrop({ onDrop }: CoinDropProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const grabOffset = useRef<Point>({ x: 0, y: 0 });
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  useEffect(() => {
    if (!isFalling) return;
    const frame = requestAnimationFrame(() => setHasLanded(true));
    return () => cancelAnimationFrame(frame);
  }, [isFalling]);

  useEffect(() => {
    if (!hasLanded) return;
    const timer = setTimeout(() => onDropRef.current(), FALL_MS + SETTLE_MS);
    return () => clearTimeout(timer);
  }, [hasLanded]);

  const toAreaPoint = (event: React.PointerEvent) => {
    const area = areaRef.current;
    if (area === null) return null;
    const rect = area.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const point = toAreaPoint(event);
    if (point === null) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    grabOffset.current = {
      x: point.x - (COIN.left + offset.x),
      y: point.y - (COIN.top + offset.y),
    };
    setIsDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const point = toAreaPoint(event);
    if (point === null) return;
    setOffset({
      x: point.x - grabOffset.current.x - COIN.left,
      y: point.y - grabOffset.current.y - COIN.top,
    });
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const centerX = COIN.left + offset.x + COIN.size / 2;
    const centerY = COIN.top + offset.y + COIN.size / 2;
    const isOverBank =
      centerX >= BANK.left &&
      centerX <= BANK.left + BANK.width &&
      centerY >= BANK.top &&
      centerY <= BANK.top + BANK.height;

    if (!isOverBank) return;
    if (prefersReducedMotion()) {
      onDrop();
      return;
    }
    setIsFalling(true);
  };

  return (
    <div ref={areaRef} className="absolute inset-0">
      <Image
        src={isFalling ? piggyBankSmileImage : piggyBankImage}
        alt=""
        width={BANK.width}
        height={BANK.height}
        priority
        className="absolute"
        style={{ left: BANK.left, top: BANK.top }}
      />

      {isFalling ? (
        <div
          aria-hidden="true"
          className="absolute flex items-center justify-center transition-transform duration-[1000ms] ease-in motion-reduce:transition-none"
          style={{
            left: FALLING_COIN.left,
            top: FALLING_COIN.top,
            width: FALLING_COIN.size,
            height: FALLING_COIN.size,
            transform: hasLanded
              ? "translateY(0)"
              : `translateY(${-(FALLING_COIN.top + FALLING_COIN.size)}px)`,
          }}
        >
          <Image
            src={coinImage}
            alt=""
            width={FALLING_COIN.size}
            height={FALLING_COIN.size}
            priority
            className="drop-shadow-[0px_7.333px_6.111px_rgba(0,0,0,0.1)]"
          />
        </div>
      ) : null}

      {isFalling ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute overflow-hidden"
          style={{
            left: BANK.left,
            top: FRONT_TOP,
            width: BANK.width,
            height: BANK.top + BANK.height - FRONT_TOP,
          }}
        >
          <Image
            src={piggyBankSmileImage}
            alt=""
            width={BANK.width}
            height={BANK.height}
            priority
            style={{ marginTop: BANK.top - FRONT_TOP }}
          />
        </div>
      ) : null}

      {isFalling ? null : (
        <div
          role="button"
          tabIndex={0}
          aria-label="동전을 저금통으로 끌어 넣기"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`absolute touch-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            left: COIN.left + offset.x,
            top: COIN.top + offset.y,
            width: COIN.size,
            height: COIN.size,
          }}
        >
          <Image
            src={coinImage}
            alt=""
            width={COIN.size}
            height={COIN.size}
            priority
            draggable={false}
            className="pointer-events-none size-full"
          />
        </div>
      )}
    </div>
  );
}
