import Image from "next/image";
import emptyCharacter from "@/../public/images/recaps/empty-character.png";
import type { RecapMonthTab } from "./monthly-recap-screen";
import { MonthlyRecapLayout } from "./monthly-recap-layout";

interface MonthlyRecapEmptyProps {
  backHref: string;
  year: number;
  months: readonly RecapMonthTab[];
  /** 아직 리캡이 없다는 것을 알리는 문구이며, 줄바꿈 문자로 줄을 나눕니다. */
  message: string;
}

/** 고른 달의 리캡이 아직 없을 때 보여주는 화면입니다. */
export function MonthlyRecapEmpty({
  backHref,
  year,
  months,
  message,
}: MonthlyRecapEmptyProps) {
  return (
    <MonthlyRecapLayout backHref={backHref} year={year} months={months}>
      <MonthlyRecapEmptyContent message={message} />
    </MonthlyRecapLayout>
  );
}

/** 선택한 달에 결과가 없는 이유를 보여줍니다. */
export function MonthlyRecapEmptyContent({
  message,
}: Pick<MonthlyRecapEmptyProps, "message">) {
  return (
    <>
      <div className="flex justify-center px-10 pt-[60px]">
        <Image
          src={emptyCharacter}
          alt=""
          width={310}
          height={310}
          sizes="310px"
          className="size-[310px]"
          priority
        />
      </div>

      <p className="text-fg-neutral-muted px-4 py-5 text-center text-[20px] leading-7 font-medium tracking-[-0.3px] whitespace-pre-line">
        {message}
      </p>
    </>
  );
}
