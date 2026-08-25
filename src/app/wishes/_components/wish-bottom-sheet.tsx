"use client";

import Link from "next/link";
import { BottomSheet } from "@/components/ui/bottom-sheet";

const ACTIONS = [
  "정보 수정",
  "대표 위시 설정",
  "목표 포기",
  "학원 피드 올리기",
] as const;

const ACTION_STYLE =
  "text-t3 text-fg-neutral flex w-full items-start pb-11 text-left font-medium";

interface WishBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  infoHref?: string;
  onRepresentative?: () => void;
}

export function WishBottomSheet({
  isOpen,
  onClose,
  infoHref,
  onRepresentative,
}: WishBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="저축 기록 내역">
      {ACTIONS.map((action) =>
        action === "정보 수정" && infoHref !== undefined ? (
          <Link key={action} href={infoHref} className={ACTION_STYLE}>
            {action}
          </Link>
        ) : (
          <button
            key={action}
            type="button"
            onClick={action === "대표 위시 설정" ? onRepresentative : undefined}
            className={ACTION_STYLE}
          >
            {action}
          </button>
        ),
      )}
    </BottomSheet>
  );
}
