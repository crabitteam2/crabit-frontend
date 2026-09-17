import Link from "next/link";
import { PiggyBankCharacter } from "./piggy-bank-character";

const DOT_PATTERN =
  "radial-gradient(ellipse 14.13px 17.17px at 14.13px 17.17px, var(--color-pink-2) 0 100%, transparent 0)";

interface DepositDoneScreenProps {
  amount: number;
}

export function DepositDoneScreen({ amount }: DepositDoneScreenProps) {
  return (
    <div
      className="bg-pink-1 relative flex min-h-dvh flex-col overflow-hidden"
      style={{
        backgroundImage: DOT_PATTERN,
        backgroundSize: "90.43px 109.91px",
        backgroundPosition: "0 -5px",
      }}
    >
      <h1 className="text-t1 text-fg-neutral relative px-4 pt-[68px] text-center font-bold">
        {amount.toLocaleString("ko-KR")}원을
        <br />
        저금통에 넣었어요!
      </h1>

      <PiggyBankCharacter expression="heart" />

      <div className="pb-action relative mt-auto px-4">
        <Link
          href="/"
          replace
          className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
