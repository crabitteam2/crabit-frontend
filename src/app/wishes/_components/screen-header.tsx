import type { ReactNode } from "react";
import { BackButton } from "@/components/ui/back-button";

type ScreenHeaderSpacing = "tight" | "default" | "loose";

const spacingStyles: Record<ScreenHeaderSpacing, string> = {
  tight: "pb-2",
  default: "pb-4",
  loose: "pb-10",
};

const BACK_STYLE = "relative block size-8 shrink-0";

interface ScreenHeaderProps {
  /** 화면 이름이며, 주지 않으면 헤더에 제목을 두지 않습니다. */
  title?: string;
  /** 기록이 없을 때 뒤로가기가 갈 경로입니다. */
  backHref?: string;
  /**
   * 뒤로가기를 기록 대신 `backHref`로 보낼지 여부입니다.
   *
   * 입력한 값을 주소에 실어 되돌아가는 단계 화면에서 씁니다.
   */
  backToHref?: boolean;
  spacing?: ScreenHeaderSpacing;
  action?: ReactNode;
}

export function ScreenHeader({
  title,
  backHref,
  backToHref = false,
  spacing = "default",
  action,
}: ScreenHeaderProps) {
  return (
    <header
      className={`bg-layer-default sticky top-0 z-20 flex items-center gap-1 px-4 pt-[calc(env(safe-area-inset-top)+12px)] ${spacingStyles[spacing]}`}
    >
      {backHref === undefined ? null : (
        <BackButton
          fallbackHref={backHref}
          usesHref={backToHref}
          className={BACK_STYLE}
        />
      )}
      {title === undefined ? null : (
        <h1 className="text-t1 text-fg-neutral font-bold">{title}</h1>
      )}
      {action ? <div className="ml-auto flex shrink-0">{action}</div> : null}
    </header>
  );
}
