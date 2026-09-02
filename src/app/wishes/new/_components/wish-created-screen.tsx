import Link from "next/link";
import characterImage from "@/../public/images/wishes/wish-created.png";
import {
  WishHeroScreen,
  type HeroCharacter,
} from "@/app/wishes/_components/wish-hero-screen";
import { emptyWishTheme } from "@/app/wishes/_components/wish-theme";

const CHARACTER: HeroCharacter = {
  src: characterImage,
  width: 200,
  height: 231,
  crop: { size: 305.5, left: -49.9, top: -27.6 },
};

interface WishCreatedScreenProps {
  purpose: string;
  targetAmount: number;
  period: string | null;
  depositHref: string;
  closeHref: string;
  photoUrl: string | null;
}

export function WishCreatedScreen({
  purpose,
  targetAmount,
  period,
  depositHref,
  closeHref,
  photoUrl,
}: WishCreatedScreenProps) {
  return (
    <WishHeroScreen
      closeHref={closeHref}
      character={CHARACTER}
      photoUrl={photoUrl}
      headline="위시리스트가 생성되었어요!"
      headlinePaddingTop={28}
      headlinePaddingBottom={24}
      percent={0}
      theme={emptyWishTheme}
      purpose={purpose}
      period={period}
      amount={0}
      targetAmount={targetAmount}
    >
      <Link
        href={depositHref}
        className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
      >
        바로 돈 넣기
      </Link>
    </WishHeroScreen>
  );
}
