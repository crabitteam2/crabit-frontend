import Image, { type StaticImageData } from "next/image";
import chevronRightIcon from "@/../public/images/common/chevron-right-muted.svg";

/** 홈 탭에서 다른 화면으로 이동하는 행의 내용입니다. */
interface LinkRowProps {
  /** 행 왼쪽에 표시할 28px 아이콘입니다. */
  icon: StaticImageData;
  /** 행에 표시할 문구입니다. */
  label: string;
}

/** 아이콘과 문구, 화살표로 이루어진 이동 행을 표시합니다. */
export function LinkRow({ icon, label }: LinkRowProps) {
  return (
    <button
      type="button"
      className="bg-layer-default flex w-full items-center justify-between rounded-[10px] px-8 py-3 text-left"
    >
      <span className="flex items-center gap-4">
        <span className="relative block size-7 shrink-0">
          <Image src={icon} alt="" fill sizes="28px" />
        </span>
        <span className="text-b2 text-fg-neutral leading-[34px] font-semibold">
          {label}
        </span>
      </span>
      <span className="relative block size-5 shrink-0">
        <Image src={chevronRightIcon} alt="" fill sizes="20px" />
      </span>
    </button>
  );
}
