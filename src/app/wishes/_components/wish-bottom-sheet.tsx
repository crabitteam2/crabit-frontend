"use client";

import Link from "next/link";
import { BottomSheet } from "@/components/ui/bottom-sheet";

const ACTIONS = [
  "정보 수정",
  "대표 위시 설정",
  "목표 포기",
  "학원 피드 올리기",
] as const;

type WishAction = (typeof ACTIONS)[number];

const ACTION_STYLE =
  "text-t3 text-fg-neutral flex w-full items-start pb-11 text-left font-medium";

interface WishBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  infoHref?: string;
  shareHref?: string;
  onRepresentative?: () => void;
  onAbandon?: () => void;
}

export function WishBottomSheet({
  isOpen,
  onClose,
  infoHref,
  shareHref,
  onRepresentative,
  onAbandon,
}: WishBottomSheetProps) {
  const hrefFor = (action: WishAction) => {
    if (action === "정보 수정") return infoHref;
    if (action === "학원 피드 올리기") return shareHref;
    return undefined;
  };

  const handlerFor = (action: WishAction) => {
    if (action === "대표 위시 설정") return onRepresentative;
    if (action === "목표 포기") return onAbandon;
    return undefined;
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="모은 돈 기록">
      {ACTIONS.map((action) =>
        hrefFor(action) !== undefined ? (
          <Link
            key={action}
            href={hrefFor(action) as string}
            className={ACTION_STYLE}
          >
            {action}
          </Link>
        ) : (
          <button
            key={action}
            type="button"
            onClick={handlerFor(action)}
            className={ACTION_STYLE}
          >
            {action}
          </button>
        ),
      )}
    </BottomSheet>
  );
}
