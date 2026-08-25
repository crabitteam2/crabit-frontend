"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import chevronIcon from "@/../public/images/common/chevron-right-brand.svg";
import { BottomSheet } from "./bottom-sheet";

const ROW_HEIGHT = 36;
const ROW_GAP = 5;
const PITCH = ROW_HEIGHT + ROW_GAP;
const VISIBLE_ROWS = 6;
const HIGHLIGHT_INDEX = 2;
const LIST_HEIGHT = VISIBLE_ROWS * ROW_HEIGHT + (VISIBLE_ROWS - 1) * ROW_GAP;

const YEARS_BEFORE = 5;
const YEARS_AFTER = 10;

const HIDE_SCROLLBAR =
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

interface MonthYearSheetProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  onChange: (view: { year: number; month: number }) => void;
}

export function MonthYearSheet({
  isOpen,
  onClose,
  year,
  month,
  onChange,
}: MonthYearSheetProps) {
  const thisYear = new Date().getFullYear();
  const years = Array.from(
    { length: YEARS_BEFORE + YEARS_AFTER + 1 },
    (_, index) => thisYear - YEARS_BEFORE + index,
  );
  const months = Array.from({ length: 12 }, (_, index) => index);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="연월 선택"
      header={
        <span className="flex items-center gap-1">
          <span className="text-fg-neutral text-[20px] leading-[23px] font-semibold tracking-[-0.3px]">
            {year}년 {month + 1}월
          </span>
          <Image
            src={chevronIcon}
            alt=""
            className="h-[8px] w-[13px] rotate-90"
          />
        </span>
      }
    >
      <div className="relative mb-5 w-full" style={{ height: LIST_HEIGHT }}>
        <div
          aria-hidden="true"
          className="bg-gray-3 absolute inset-x-0 rounded-lg"
          style={{ top: HIGHLIGHT_INDEX * PITCH, height: ROW_HEIGHT }}
        />
        <div className="relative flex justify-center gap-5">
          <Wheel
            label="연도"
            items={years}
            value={year}
            format={(value) => `${value}년`}
            width={65}
            onSelect={(next) => onChange({ year: next, month })}
          />
          <Wheel
            label="월"
            items={months}
            value={month}
            format={(value) => `${value + 1}월`}
            width={40}
            onSelect={(next) => onChange({ year, month: next })}
          />
        </div>
      </div>
    </BottomSheet>
  );
}

interface WheelProps {
  label: string;
  items: number[];
  value: number;
  format: (value: number) => string;
  width: number;
  onSelect: (value: number) => void;
}

function Wheel({ label, items, value, format, width, onSelect }: WheelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const selected = items.indexOf(value);

  useEffect(() => {
    const list = ref.current;
    if (list === null || selected < 0) return;
    list.scrollTop = selected * PITCH;
  }, [selected]);

  const syncFromScroll = () => {
    const list = ref.current;
    if (list === null) return;
    const index = Math.min(
      items.length - 1,
      Math.max(0, Math.round(list.scrollTop / PITCH)),
    );
    if (items[index] !== value) onSelect(items[index]);
  };

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={label}
      onScroll={syncFromScroll}
      className={`snap-y snap-mandatory overflow-y-auto ${HIDE_SCROLLBAR}`}
      style={{
        width,
        height: LIST_HEIGHT,
        paddingTop: HIGHLIGHT_INDEX * PITCH,
        paddingBottom: (VISIBLE_ROWS - 1 - HIGHLIGHT_INDEX) * PITCH,
      }}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          role="option"
          aria-selected={item === value}
          onClick={() => onSelect(item)}
          className={`flex w-full snap-start items-center text-[20px] leading-[28px] font-medium tracking-[-0.3px] ${
            item === value ? "text-gray-10" : "text-gray-5"
          }`}
          style={{ height: ROW_HEIGHT, marginBottom: ROW_GAP }}
        >
          {format(item)}
        </button>
      ))}
    </div>
  );
}
