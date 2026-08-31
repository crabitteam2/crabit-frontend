"use client";

import Image from "next/image";
import { useState } from "react";
import moreIcon from "@/../public/images/wishes/more.svg";
import { WishActionSheet } from "./wish-action-sheet";
import type { OwnedWishItem } from "./wish-item";

interface WishDetailActionsProps {
  wish: OwnedWishItem;
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
