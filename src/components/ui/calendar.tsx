"use client";

import Image from "next/image";
import { useState } from "react";
import chevronBrandIcon from "@/../public/images/common/chevron-right-brand.svg";
import chevronIcon from "@/../public/images/common/chevron-left.svg";
import { MonthYearSheet } from "./month-year-sheet";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export interface DateRange {
  start: string | null;
  end: string | null;
}

interface CalendarProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

const pad = (value: number) => String(value).padStart(2, "0");

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;

const fromDateKey = (key: string) => {
  const [year, month, day] = key.split(".").map(Number);
  return new Date(year, month - 1, day);
};

const buildWeeks = (year: number, month: number) => {
  const offset = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: days }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return Array.from({ length: cells.length / 7 }, (_, week) =>
    cells.slice(week * 7, week * 7 + 7),
  );
};

export function Calendar({ value, onChange }: CalendarProps) {
  const [view, setView] = useState(() => {
    const base = value.start === null ? new Date() : fromDateKey(value.start);
    return { year: base.getFullYear(), month: base.getMonth() };
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const moveMonth = (step: number) => {
    const moved = new Date(view.year, view.month + step, 1);
    setView({ year: moved.getFullYear(), month: moved.getMonth() });
  };

  const select = (day: number) => {
    const key = toDateKey(new Date(view.year, view.month, day));
    if (key === value.start) {
      onChange({ start: null, end: null });
      return;
    }
    if (value.start === null || value.end !== null || key < value.start) {
      onChange({ start: key, end: null });
      return;
    }
    onChange({ start: value.start, end: key });
  };

  return (
    <div className="bg-gray-2 w-full rounded-[10px] p-3">
      <div className="[box-sizing:content-box] flex h-6 items-center justify-between pt-[13px] pb-[3px]">
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="flex items-center gap-1"
        >
          <span className="text-fg-neutral text-[20px] leading-[23px] font-semibold tracking-[-0.3px]">
            {view.year}년 {view.month + 1}월
          </span>
          <Image src={chevronBrandIcon} alt="" className="h-[13px] w-[8px]" />
        </button>

        <div className="flex items-center gap-7">
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => moveMonth(-1)}
            className="flex h-6 w-[10px] items-center"
          >
            <Image src={chevronIcon} alt="" className="h-[18px] w-[10px]" />
          </button>
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => moveMonth(1)}
            className="flex h-6 w-[10px] items-center"
          >
            <Image
              src={chevronIcon}
              alt=""
              className="h-[18px] w-[10px] -scale-x-100"
            />
          </button>
        </div>
      </div>

      <div className="py-2">
        <div className="flex h-5 items-center justify-between">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="text-gray-5 w-[38px] text-center text-[13px] leading-[18px] font-semibold"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-[13px] pt-[7px]">
          {buildWeeks(view.year, view.month).map((week, index) => (
            <div
              key={`${view.year}.${view.month}.${index}`}
              className="flex items-center justify-between"
            >
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return (
                    <span key={`empty-${dayIndex}`} className="size-[38px]" />
                  );
                }

                const key = toDateKey(new Date(view.year, view.month, day));
                const isEdge = key === value.start || key === value.end;
                const isBetween =
                  value.start !== null &&
                  value.end !== null &&
                  key > value.start &&
                  key < value.end;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => select(day)}
                    aria-label={`${view.year}년 ${view.month + 1}월 ${day}일`}
                    aria-pressed={isEdge}
                    className={`size-[38px] rounded-full text-[20px] leading-[24px] tracking-[-0.45px] ${dayStyle(
                      isEdge,
                      isBetween,
                    )}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <MonthYearSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        year={view.year}
        month={view.month}
        onChange={setView}
      />
    </div>
  );
}

function dayStyle(isEdge: boolean, isBetween: boolean) {
  if (isEdge) return "bg-pink-6 text-white";
  if (isBetween) return "bg-pink-6/12 text-pink-6";
  return "text-fg-neutral";
}
