"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import radioOffIcon from "@/../public/images/common/radio-off.svg";
import radioOnIcon from "@/../public/images/common/radio-on.svg";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { shareWishAction } from "../wish-actions";

const VISIBILITIES = [
  { value: "ACADEMY", label: "학원 전체" },
  { value: "FRIENDS", label: "친한 친구 공개" },
] as const;

type Visibility = (typeof VISIBILITIES)[number]["value"];

interface WishShareWriteFormProps {
  wishId: string;
  version: number;
  donePath: string;
}

export function WishShareWriteForm({
  wishId,
  version,
  donePath,
}: WishShareWriteFormProps) {
  const router = useRouter();
  const [visibility, setVisibility] = useState<Visibility>("ACADEMY");
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const share = async () => {
    if (isSharing) return;
    setIsSharing(true);

    const result = await shareWishAction(wishId, version, visibility);
    if (result.ok) {
      router.replace(donePath);
      return;
    }
    setIsSharing(false);
    setError(result.message);
  };

  return (
    <>
      <div className="flex items-start px-4 pt-5 pb-6">
        <h2 className="text-fg-neutral text-[24px] leading-7 font-semibold tracking-[-0.3px]">
          공개 대상
        </h2>
      </div>

      <div
        role="radiogroup"
        aria-label="공개 대상"
        className="flex flex-col px-4"
      >
        {VISIBILITIES.map((item) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={item.value === visibility}
            onClick={() => setVisibility(item.value)}
            className="flex items-center gap-3 text-left"
          >
            <Image
              src={item.value === visibility ? radioOnIcon : radioOffIcon}
              alt=""
              width={16}
              height={16}
              className="size-4 shrink-0"
            />
            <span className="text-fg-neutral text-[16px] leading-7 tracking-[-0.3px]">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="h-[calc(131px+env(safe-area-inset-bottom))]" />

      <div className="max-w-app fixed inset-x-0 bottom-0 z-10 mx-auto w-full bg-white px-4 pt-5 pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Button
          size="xlarge"
          className="w-full"
          isLoading={isSharing}
          onClick={() => void share()}
        >
          공유하기
        </Button>
      </div>

      {error === null ? null : (
        <Toast message={error} tone="danger" onClose={() => setError(null)} />
      )}
    </>
  );
}
