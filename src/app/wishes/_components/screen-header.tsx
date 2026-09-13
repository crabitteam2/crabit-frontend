import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import arrowLeftIcon from "@/../public/images/wishes/arrow-left.svg";
import { BackButton } from "./back-button";

type ScreenHeaderSpacing = "tight" | "default" | "loose";

const spacingStyles: Record<ScreenHeaderSpacing, string> = {
  tight: "pb-2",
  default: "pb-4",
  loose: "pb-10",
};

const BACK_STYLE = "relative block size-8 shrink-0";

interface ScreenHeaderProps {
  title: string;
  backHref?: string;
  /**
   * 뒤로가기를 브라우저 기록의 이전 페이지로 보낼지 여부입니다.
   *
   * 들어온 길이 여럿인 화면에서 씁니다. 기록이 없으면 `backHref`로 갑니다.
   */
  backToPrevious?: boolean;
  spacing?: ScreenHeaderSpacing;
  action?: ReactNode;
}

export function ScreenHeader({
  title,
  backHref,
  backToPrevious = false,
  spacing = "default",
  action,
}: ScreenHeaderProps) {
  return (
    <header
      className={`bg-layer-default sticky top-0 z-20 flex items-center gap-1 px-4 pt-[calc(env(safe-area-inset-top)+12px)] ${spacingStyles[spacing]}`}
    >
      {backHref === undefined ? null : backToPrevious ? (
        <BackButton fallbackHref={backHref} className={BACK_STYLE} />
      ) : (
        <Link href={backHref} aria-label="뒤로 가기" className={BACK_STYLE}>
          <Image src={arrowLeftIcon} alt="" fill sizes="32px" />
        </Link>
      )}
      <h1 className="text-t1 text-fg-neutral font-bold">{title}</h1>
      {action ? <div className="ml-auto flex shrink-0">{action}</div> : null}
    </header>
  );
}
