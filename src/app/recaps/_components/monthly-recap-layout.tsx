import type { ReactNode } from "react";
import { BackButton } from "@/components/ui/back-button";
import { RecapMonthTabs } from "./recap-month-tabs";
import { RecapYearSelect } from "./recap-year-select";
import { RecapPattern } from "./recap-pattern";
import { getRecapTheme } from "./recap-theme";
import type { RecapMonthTab } from "./monthly-recap-screen";

/** 결과 유무가 바뀌어도 월 선택 줄의 DOM과 스크롤 위치를 유지하는 공통 틀입니다. */
export function MonthlyRecapLayout({
  backHref,
  year,
  months,
  typeTitle,
  children,
}: {
  backHref: string;
  year: number;
  months: readonly RecapMonthTab[];
  typeTitle?: string;
  children: ReactNode;
}) {
  const theme = typeTitle === undefined ? null : getRecapTheme(typeTitle);
  return (
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden"
      style={
        theme === null
          ? undefined
          : {
              backgroundImage: `linear-gradient(to bottom, ${theme.gradient[0]}, ${theme.gradient[1]})`,
            }
      }
    >
      {theme === null ? null : (
        <RecapPattern kind={theme.pattern.kind} color={theme.pattern.color} />
      )}
      <header
        className={`relative flex items-center justify-between border-b px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4 ${theme === null ? "border-gray-3" : "border-white"}`}
      >
        <BackButton
          fallbackHref={backHref}
          className={`relative block size-8 shrink-0 ${theme === null ? "" : "brightness-0 invert"}`}
        />
        <RecapYearSelect year={year} isOnDarkBackground={theme !== null} />
      </header>
      <RecapMonthTabs
        year={year}
        months={months}
        currentStyle={theme === null ? "text-fg-neutral" : "text-gray-9"}
        restStyle={theme === null ? "text-gray-4" : "text-static-white"}
      />
      {children}
    </div>
  );
}
