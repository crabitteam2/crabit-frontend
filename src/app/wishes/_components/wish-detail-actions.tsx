"use client";

import Image from "next/image";
import { useState } from "react";
import moreIcon from "@/../public/images/wishes/more.svg";
import { WishBottomSheet } from "./wish-bottom-sheet";

interface WishDetailActionsProps {
  wishId: string;
  purpose: string;
}

export function WishDetailActions({ wishId, purpose }: WishDetailActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`${purpose} 더보기`}
        className="relative block size-8 shrink-0"
      >
        <Image src={moreIcon} alt="" fill sizes="32px" />
      </button>
      <WishBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        infoHref={`/wishes/${wishId}/info`}
      />
    </>
  );
}
