"use client";

import Image from "next/image";
import { useState } from "react";
import moreIcon from "@/../public/images/wishes/more.svg";
import type { Wish } from "@/lib/mock/wishes";
import { WishActionSheet } from "./wish-action-sheet";

interface WishDetailActionsProps {
  wish: Wish;
}

export function WishDetailActions({ wish }: WishDetailActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`${wish.purpose} 더보기`}
        className="relative block size-8 shrink-0"
      >
        <Image src={moreIcon} alt="" fill sizes="32px" />
      </button>
      <WishActionSheet
        wish={isOpen ? wish : null}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
