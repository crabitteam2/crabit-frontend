import Image from "next/image";
import profileImage from "@/../public/images/home/academy-profile.png";
import notificationIcon from "@/../public/images/home/notification.svg";
import chevronRightIcon from "@/../public/images/common/chevron-right.svg";

/** 홈 탭 상단에 표시할 학원 정보입니다. */
interface HomeTabHeaderProps {
  /** 사용자에게 노출할 학원 이름입니다. */
  academyName: string;
}

/** 학원 프로필과 알림 버튼을 홈 탭 상단에 표시합니다. */
export function HomeTabHeader({ academyName }: HomeTabHeaderProps) {
  return (
    <header className="bg-layer-basement sticky top-0 z-20 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
      <button type="button" className="flex items-center gap-4 text-left">
        <span className="border-gray-2 relative block size-10 shrink-0 overflow-hidden rounded-[6.667px] border-[1.111px]">
          <Image
            src={profileImage}
            alt=""
            fill
            sizes="40px"
            className="object-cover"
          />
        </span>
        <span className="flex items-center gap-1">
          <span className="text-b2 text-fg-neutral leading-[34px] font-semibold">
            {academyName}
          </span>
          <span className="relative block size-5 shrink-0">
            <Image src={chevronRightIcon} alt="" fill sizes="20px" />
          </span>
        </span>
      </button>
      <button
        type="button"
        aria-label="알림"
        className="relative block size-5 shrink-0"
      >
        <Image src={notificationIcon} alt="" fill sizes="20px" />
      </button>
    </header>
  );
}
