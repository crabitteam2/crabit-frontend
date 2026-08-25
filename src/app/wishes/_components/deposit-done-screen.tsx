import Image from "next/image";
import Link from "next/link";
import piggyBankImage from "@/../public/images/wishes/piggy-bank.png";

const DOT_PATTERN =
  "radial-gradient(ellipse 14.13px 17.17px at 14.13px 17.17px, var(--color-pink-2) 0 100%, transparent 0)";

interface DepositDoneScreenProps {
  amount: number;
}

export function DepositDoneScreen({ amount }: DepositDoneScreenProps) {
  return (
    <div
      className="bg-pink-1 relative flex min-h-svh flex-col overflow-hidden"
      style={{
        backgroundImage: DOT_PATTERN,
        backgroundSize: "90.43px 109.91px",
        backgroundPosition: "0 -5px",
      }}
    >
      <h1 className="text-t1 text-fg-neutral relative px-4 pt-[70px] text-center font-bold">
        {amount.toLocaleString("ko-KR")}원을
        <br />
        저축했어요!
      </h1>

      <Image
        src={piggyBankImage}
        alt=""
        width={207}
        height={277}
        priority
        className="absolute"
        style={{ left: 92, top: 310 }}
      />

      <div className="relative mt-auto px-4 pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Link
          href="/"
          className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
