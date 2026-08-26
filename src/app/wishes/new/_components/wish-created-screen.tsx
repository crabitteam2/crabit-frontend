"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import closeIcon from "@/../public/images/wishes/close-32.svg";
import characterImage from "@/../public/images/wishes/wish-created.png";
import { WishProgressBar } from "@/app/wishes/_components/wish-progress-bar";
import { emptyWishTheme } from "@/app/wishes/_components/wish-theme";
import { readNewWishPhoto } from "./photo-storage";

const CHARACTER = {
  frameWidth: 200,
  frameHeight: 231,
  imageSize: 305.5,
  imageLeft: -49.9,
  imageTop: -27.6,
};

interface WishCreatedScreenProps {
  purpose: string;
  targetAmount: number;
  period: string | null;
  depositHref: string;
  closeHref: string;
}

export function WishCreatedScreen({
  purpose,
  targetAmount,
  period,
  depositHref,
  closeHref,
}: WishCreatedScreenProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => setPhotoUrl(readNewWishPhoto()), []);

  return (
    <div className="bg-pink-1 flex min-h-svh flex-col">
      <header className="flex justify-end px-4 pt-[calc(env(safe-area-inset-top)+10px)]">
        <Link
          href={closeHref}
          aria-label="닫기"
          className="relative block size-8"
        >
          <Image src={closeIcon} alt="" fill sizes="32px" />
        </Link>
      </header>

      <div className="flex justify-center pt-3">
        {photoUrl === null ? (
          <div
            className="relative overflow-hidden"
            style={{
              width: CHARACTER.frameWidth,
              height: CHARACTER.frameHeight,
            }}
          >
            <Image
              src={characterImage}
              alt=""
              width={CHARACTER.imageSize}
              height={CHARACTER.imageSize}
              priority
              className="absolute max-w-none"
              style={{ left: CHARACTER.imageLeft, top: CHARACTER.imageTop }}
            />
          </div>
        ) : (
          <Image
            src={photoUrl}
            alt="선택한 목표 사진"
            width={232}
            height={232}
            unoptimized
            className="size-[232px] rounded-full object-cover"
          />
        )}
      </div>

      <div className="px-4 pt-7 pb-6">
        <p className="text-fg-neutral pb-[10px] text-center text-[22px] leading-[30px] font-semibold tracking-[-0.3px]">
          위시리스트가 생성되었어요!
        </p>
      </div>

      <div className="px-4">
        <WishProgressBar percent={0} theme={emptyWishTheme} />
      </div>

      <div className="flex flex-col px-4 pt-5">
        <p className="text-fg-neutral truncate pb-2 text-[20px] leading-7 font-semibold tracking-[-0.3px]">
          {purpose}
        </p>
        <p className="text-gray-6 pb-6 text-[14px] leading-7 tracking-[-0.3px]">
          저축 기간: {period ?? "설정된 기간 없음"}
        </p>
        <p className="text-pink-6 flex justify-end font-bold tracking-[-0.3px]">
          <span className="text-[28px] leading-[34px]">0</span>
          <span className="text-[26px] leading-[34px]">&nbsp;원</span>
        </p>
        <p className="text-gray-6 flex justify-end pb-3 text-[14px] leading-[34px] tracking-[-0.3px]">
          {targetAmount.toLocaleString("ko-KR")} 원
        </p>
      </div>

      <div className="flex-1" />

      <div className="px-4 pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Link
          href={depositHref}
          className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
        >
          바로 입금하러 가기
        </Link>
      </div>
    </div>
  );
}
