import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import arrowLeftIcon from "@/../public/images/wishes/arrow-left.svg";

interface ScreenHeaderProps {
  title: string;
  backHref: string;
  dense?: boolean;
  action?: ReactNode;
}

export function ScreenHeader({
  title,
  backHref,
  dense,
  action,
}: ScreenHeaderProps) {
  return (
    <header
      className={`flex items-center gap-1 px-4 pt-[calc(env(safe-area-inset-top)+12px)] ${dense ? "pb-2" : "pb-4"}`}
    >
      <Link
        href={backHref}
        aria-label="뒤로 가기"
        className="relative block size-8 shrink-0"
      >
        <Image src={arrowLeftIcon} alt="" fill sizes="32px" />
      </Link>
      <h1 className="text-t1 text-fg-neutral font-bold whitespace-nowrap">
        {title}
      </h1>
      {action ? <div className="ml-auto flex shrink-0">{action}</div> : null}
    </header>
  );
}
