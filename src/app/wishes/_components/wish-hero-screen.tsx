import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import closeIcon from "@/../public/images/wishes/close-32.svg";
import { WishProgressBar } from "./wish-progress-bar";
import type { WishTheme } from "./wish-theme";

const PHOTO_SIZE = 232;

export interface HeroCharacter {
  src: StaticImageData;
  width: number;
  height: number;
  crop?: { size: number; left: number; top: number };
}

interface WishHeroContentProps {
  character: HeroCharacter;
  photoUrl: string | null;
  headline: string;
  headlinePaddingTop: number;
  headlinePaddingBottom: number;
  percent: number;
  theme: WishTheme;
  purpose: string;
  period: string | null;
  amount: number;
  targetAmount: number;
}

export function WishHeroContent({
  character,
  photoUrl,
  headline,
  headlinePaddingTop,
  headlinePaddingBottom,
  percent,
  theme,
  purpose,
  period,
  amount,
  targetAmount,
}: WishHeroContentProps) {
  const headlineTop =
    photoUrl === null
      ? headlinePaddingTop
      : headlinePaddingTop + character.height - PHOTO_SIZE;

  return (
    <>
      <div className="flex justify-center pt-3">
        {photoUrl === null ? (
          <div
            className="relative overflow-hidden"
            style={{ width: character.width, height: character.height }}
          >
            {character.crop === undefined ? (
              <Image
                src={character.src}
                alt=""
                width={character.width}
                height={character.height}
                priority
                className="size-full object-contain object-bottom"
              />
            ) : (
              <Image
                src={character.src}
                alt=""
                width={character.crop.size}
                height={character.crop.size}
                priority
                className="absolute max-w-none"
                style={{ left: character.crop.left, top: character.crop.top }}
              />
            )}
          </div>
        ) : (
          <Image
            src={photoUrl}
            alt="목표 사진"
            width={PHOTO_SIZE}
            height={PHOTO_SIZE}
            unoptimized
            className="size-[232px] rounded-full object-cover"
          />
        )}
      </div>

      <div
        className="px-4"
        style={{
          paddingTop: headlineTop,
          paddingBottom: headlinePaddingBottom,
        }}
      >
        <p className="text-fg-neutral pb-[10px] text-center text-[22px] leading-[30px] font-semibold tracking-[-0.3px]">
          {headline}
        </p>
      </div>

      <div className="px-4">
        <WishProgressBar percent={percent} theme={theme} />
      </div>

      <div className="flex flex-col px-4 pt-5">
        <p className="text-fg-neutral truncate pb-2 text-[20px] leading-7 font-semibold tracking-[-0.3px]">
          {purpose}
        </p>
        <p className="text-gray-6 pb-6 text-[14px] leading-7 tracking-[-0.3px]">
          기간: {period ?? "설정된 기간 없음"}
        </p>
        <p className="text-pink-6 flex justify-end font-bold tracking-[-0.3px]">
          <span className="text-[28px] leading-[34px]">
            {amount.toLocaleString("ko-KR")}
          </span>
          <span className="text-[26px] leading-[34px]">&nbsp;원</span>
        </p>
        <p className="text-gray-6 flex justify-end pb-3 text-[14px] leading-[34px] tracking-[-0.3px]">
          {targetAmount.toLocaleString("ko-KR")} 원
        </p>
      </div>
    </>
  );
}

interface WishHeroScreenProps extends WishHeroContentProps {
  closeHref: string;
  children: ReactNode;
}

export function WishHeroScreen({
  closeHref,
  children,
  ...content
}: WishHeroScreenProps) {
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

      <WishHeroContent {...content} />

      <div className="flex-1" />

      <div className="px-4 pb-[calc(55px+env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );
}
