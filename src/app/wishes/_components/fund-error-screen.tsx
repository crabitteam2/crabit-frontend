import Image from "next/image";
import Link from "next/link";
import errorIcon from "@/../public/images/wishes/error.svg";

/** 사유를 문장 단위로 끊어 줄을 나눕니다. */
function toReasonLines(reason: string) {
  const parts = reason.split(/\.\s+/);
  return parts
    .map((part, index) => (index < parts.length - 1 ? `${part}.` : part))
    .filter((part) => part !== "");
}

/** 오류 화면 제목에 들어가는 동작 이름입니다. */
export type FundErrorAction = "돈 넣기" | "돈 꺼내기" | "잔액 조정";

/** 화면을 나가는 버튼의 문구와 경로입니다. */
interface FundErrorExit {
  readonly href: string;
  readonly label: string;
}

interface FundErrorScreenProps {
  /** 실패한 동작이며 제목에 그대로 들어갑니다. */
  action: FundErrorAction;
  /** 사유 줄에 적을 문구입니다. */
  reason: string;
  /** 돌아갈 곳이며, 주지 않으면 홈으로 보냅니다. */
  exit?: FundErrorExit;
}

/** 자금을 옮기지 못했을 때 사유와 함께 보여주는 화면입니다. */
export function FundErrorScreen({
  action,
  reason,
  exit,
}: FundErrorScreenProps) {
  return (
    <div className="bg-pink-1 flex min-h-dvh flex-col">
      <div className="flex justify-center pt-[calc(env(safe-area-inset-top)+48px)]">
        <Image src={errorIcon} alt="" width={120} height={120} priority />
      </div>

      <div className="flex flex-col items-center px-4 pt-3 pb-10">
        <h1 className="text-t2 text-fg-neutral pb-[10px] text-center font-semibold">
          {action} 중 오류가 발생했어요.
        </h1>
        <p className="text-fg-neutral-muted w-[286px] text-center text-[16px] leading-7 font-medium tracking-[-0.3px] break-keep">
          {toReasonLines(reason).map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className="mt-auto px-4 pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Link
          href={exit?.href ?? "/"}
          replace
          className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
        >
          {exit?.label ?? "홈으로"}
        </Link>
      </div>
    </div>
  );
}
