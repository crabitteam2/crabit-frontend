"use client";

import Image from "next/image";
import { useState } from "react";
import questionIcon from "@/../public/images/adjust/question.svg";
import { AdjustHelpDialog } from "./adjust-help-dialog";

/** 카드 잔액을 맞추는 방법을 여는 물음표 버튼입니다. */
export function AdjustHelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="카드 잔액 맞추는 방법"
        onClick={() => setIsOpen(true)}
        className="relative block size-8 shrink-0"
      >
        <Image src={questionIcon} alt="" fill sizes="32px" />
      </button>

      <AdjustHelpDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
