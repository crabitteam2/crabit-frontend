"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import topIcon from "@/../public/images/wishes/top.svg";

const SHOW_AFTER = 240;

export function TopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="max-w-app pointer-events-none fixed inset-x-0 bottom-0 z-10 mx-auto h-0 w-full">
      <button
        type="button"
        aria-label="맨 위로 이동"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`pointer-events-auto absolute right-[18px] bottom-[calc(3rem+env(safe-area-inset-bottom))] block size-24 transition-opacity duration-200 motion-reduce:transition-none ${
          isVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Image src={topIcon} alt="" fill sizes="96px" />
      </button>
    </div>
  );
}
