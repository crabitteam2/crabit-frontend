import Image from "next/image";
import Link from "next/link";
import chevronLeftIcon from "@/../public/images/wishes/arrow-left.svg";
import emptyImage from "@/../public/images/recaps/empty.png";
import type { RecapMonthTab } from "./monthly-recap-screen";
import { RecapYearSelect, type RecapYearOption } from "./recap-year-select";

interface MonthlyRecapEmptyProps {
  backHref: string;
  year: number;
  yearOptions: readonly RecapYearOption[];
  months: readonly RecapMonthTab[];
  /** 아직 리캡이 없다는 것을 알리는 문구이며, 줄바꿈 문자로 줄을 나눕니다. */
  message: string;
}

/** 고른 달의 리캡이 아직 없을 때 보여주는 화면입니다. */
export function MonthlyRecapEmpty({
  backHref,
  year,
  yearOptions,
  months,
  message,
}: MonthlyRecapEmptyProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-gray-3 flex items-center justify-between border-b px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
        <Link
          href={backHref}
          aria-label="뒤로 가기"
          className="relative block size-8 shrink-0"
        >
          <Image src={chevronLeftIcon} alt="" fill sizes="32px" />
        </Link>
        <RecapYearSelect year={year} options={yearOptions} />
      </header>

      <nav
        aria-label="월 선택"
        className="flex items-center justify-between px-6 py-5"
      >
        {months.map((month) =>
          month.href === null ? (
            <span
              key={month.label}
              aria-current="page"
              className="text-fg-neutral text-[20px] leading-7 font-medium tracking-[-0.3px] whitespace-nowrap"
            >
              {month.label}
            </span>
          ) : (
            <Link
              key={month.label}
              href={month.href}
              className="text-gray-4 text-[20px] leading-7 font-medium tracking-[-0.3px] whitespace-nowrap"
            >
              {month.label}
            </Link>
          ),
        )}
      </nav>

      <Image
        src={emptyImage}
        alt=""
        width={390}
        height={370}
        className="w-full"
        priority
      />

      <p className="text-fg-neutral-muted px-4 py-5 text-center text-[20px] leading-7 font-medium tracking-[-0.3px] whitespace-pre-line">
        {message}
      </p>
    </div>
  );
}
