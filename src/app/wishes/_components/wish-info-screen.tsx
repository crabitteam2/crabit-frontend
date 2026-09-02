import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ScreenHeader } from "./screen-header";

interface WishInfoScreenProps {
  backHref: string;
  editHref: string;
  purpose: string;
  targetAmount: number;
  period: string | null;
  photoUrl: string | null;
}

export function WishInfoScreen({
  backHref,
  editHref,
  purpose,
  targetAmount,
  period,
  photoUrl,
}: WishInfoScreenProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <ScreenHeader title="기본 정보" backHref={backHref} spacing="loose" />

      {photoUrl === null ? null : (
        <div className="flex justify-center pb-5">
          <Image
            src={photoUrl}
            alt="위시 사진"
            width={112}
            height={112}
            unoptimized
            className="size-28 rounded-full object-cover"
          />
        </div>
      )}

      <div className="px-4 pt-5 pb-[76px]">
        <Input label="위시" readOnly value={purpose} />
      </div>

      <div className="px-4 py-5">
        <Input
          label="위시 금액"
          readOnly
          value={`${targetAmount.toLocaleString("ko-KR")}원`}
        />
      </div>

      <div className="px-4 py-5">
        <Input
          label="위시 기간"
          readOnly
          value={period ?? ""}
          placeholder="설정된 기간 없음"
        />
      </div>

      <div className="mt-auto px-4 pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Link
          href={editHref}
          className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
        >
          내 정보 수정
        </Link>
      </div>
    </div>
  );
}
