"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ScreenHeader } from "@/app/wishes/_components/screen-header";
import { Button } from "@/components/ui/button";

interface ErrorScreenProps {
  /** 헤더에 쓸 화면 이름이며, 주지 않으면 뒤로가기만 그립니다. */
  title?: string;
  /** 기록이 없을 때 뒤로가기가 갈 경로입니다. */
  backHref?: string;
  /** 화면이 쓰는 머리말이며, 주면 기본 헤더 대신 그립니다. */
  header?: ReactNode;
  /** 가운데 첫 줄입니다. 둘째 줄은 화면이 항상 같게 그립니다. */
  message: string;
  /**
   * 다시 조회하는 처리입니다.
   *
   * 주지 않으면 다시 시도해도 같은 자리로 돌아올 수 없는 화면으로 보고
   * `홈으로` 버튼을 그립니다.
   */
  reset?: () => void;
  /** 탭 바가 있는 화면인지 여부이며, 버튼 아래 여백을 넓힙니다. */
  hasTabBar?: boolean;
  /** 화면 배경처럼 바깥 상자에 더할 클래스입니다. */
  className?: string;
}

/** 조회에 실패했을 때 같은 모양으로 알리는 화면입니다. */
export function ErrorScreen({
  title,
  backHref = "/",
  header,
  message,
  reset,
  hasTabBar = false,
  className = "",
}: ErrorScreenProps) {
  const router = useRouter();

  return (
    <div className={`flex min-h-dvh flex-col ${className}`}>
      {header ?? <ScreenHeader title={title} backHref={backHref} />}

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <p className="text-fg-neutral-muted text-center text-[20px] leading-7 font-medium tracking-[-0.3px]">
          {message}
          <br />
          잠시 후 다시 시도해 주세요
        </p>
      </div>

      <div
        className={`px-4 ${hasTabBar ? "pb-[calc(96px+env(safe-area-inset-bottom))]" : "pb-action"}`}
      >
        {reset === undefined ? (
          <Link
            href="/"
            replace
            className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
          >
            홈으로
          </Link>
        ) : (
          <Button
            size="xlarge"
            className="w-full"
            onClick={() => {
              router.refresh();
              reset();
            }}
          >
            다시 시도
          </Button>
        )}
      </div>
    </div>
  );
}
