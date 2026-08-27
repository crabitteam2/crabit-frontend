import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import arrowLeftIcon from "@/../public/images/wishes/arrow-left.svg";

type ScreenHeaderSpacing = "tight" | "default" | "loose";

const spacingStyles: Record<ScreenHeaderSpacing, string> = {
  tight: "pb-2",
  default: "pb-4",
  loose: "pb-10",
};

interface ScreenHeaderProps {
  title: string;
  backHref?: string;
  spacing?: ScreenHeaderSpacing;
  action?: ReactNode;
}

export function ScreenHeader({
  title,
  backHref,
  spacing = "default",
  action,
}: ScreenHeaderProps) {
  return (
    <header
      className={`bg-layer-default sticky top-0 z-20 flex items-center gap-1 px-4 pt-[calc(env(safe-area-inset-top)+12px)] ${spacingStyles[spacing]}`}
    >
      {backHref === undefined ? null : (
        <Link
          href={backHref}
          aria-label="뒤로 가기"
          className="relative block size-8 shrink-0"
        >
          <Image src={arrowLeftIcon} alt="" fill sizes="32px" />
        </Link>
      )}
      <h1 className="text-t1 text-fg-neutral font-bold">{title}</h1>
      {action ? <div className="ml-auto flex shrink-0">{action}</div> : null}
    </header>
  );
}
