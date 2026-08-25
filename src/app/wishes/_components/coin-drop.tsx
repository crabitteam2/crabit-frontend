"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import coinImage from "@/../public/images/wishes/coin.png";
import piggyBankImage from "@/../public/images/wishes/piggy-bank.png";

const COIN = { left: -5, top: 215, size: 144 };
const BANK = { left: 92, top: 310, width: 207, height: 277 };

interface Point {
  x: number;
  y: number;
}

interface CoinDropProps {
  onDrop: () => void;
}

export function CoinDrop({ onDrop }: CoinDropProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const grabOffset = useRef<Point>({ x: 0, y: 0 });
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

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

    if (isOverBank) onDrop();
  };

  return (
    <div ref={areaRef} className="absolute inset-0">
      <Image
        src={piggyBankImage}
        alt=""
        width={BANK.width}
        height={BANK.height}
        priority
        className="absolute"
        style={{ left: BANK.left, top: BANK.top }}
      />
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
    </div>
  );
}
