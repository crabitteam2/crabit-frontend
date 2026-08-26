import Image from "next/image";
import Link from "next/link";
import successImage from "@/../public/images/wishes/success.svg";
import { Input } from "@/components/ui/input";
import { ScreenHeader } from "./screen-header";

interface WishEditDoneScreenProps {
  purpose: string;
  targetAmount: number;
  period: string | null;
}

export function WishEditDoneScreen({
  purpose,
  targetAmount,
  period,
}: WishEditDoneScreenProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <ScreenHeader title="기본 정보 수정" spacing="loose" />

      <div className="flex justify-center">
        <Image src={successImage} alt="" width={96} height={96} priority />
      </div>

      <div className="flex flex-col items-center px-4 pt-3 pb-10">
        <p className="text-t2 text-fg-neutral pb-[10px] text-center font-semibold">
          정보 수정이 완료되었어요.
        </p>
      </div>

      <div className="px-4 pt-[60px] pb-5">
        <Input label="위시" variant="line-brand" readOnly value={purpose} />
      </div>

      <div className="px-4 py-5">
        <Input
          label="위시 금액"
          variant="line-brand"
          readOnly
          value={`${targetAmount.toLocaleString("ko-KR")}원`}
        />
      </div>

      <div className="px-4 py-5">
        <Input
          label="위시 기간"
          variant="line-brand"
          readOnly
          value={period ?? ""}
          placeholder="설정된 기간 없음"
        />
      </div>

      <div className="mt-auto px-4 pb-[calc(55px+env(safe-area-inset-bottom))]">
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
