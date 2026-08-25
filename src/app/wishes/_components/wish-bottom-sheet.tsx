"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";

const ACTIONS = [
  "정보 수정",
  "대표 위시 설정",
  "목표 포기",
  "학원 피드 올리기",
] as const;

interface WishBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishBottomSheet({ isOpen, onClose }: WishBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="저축 기록 내역">
      {ACTIONS.map((action) => (
        <button
          key={action}
          type="button"
          className="text-t3 text-fg-neutral flex w-full items-start pb-11 text-left font-medium"
        >
          {action}
        </button>
      ))}
    </BottomSheet>
  );
}
