import Image from "next/image";
import Link from "next/link";
import bannerImage from "@/../public/images/home/academy-banner.png";

/** 학원 카드에 표시할 현재 학원 정보입니다. */
interface AcademySectionProps {
  /** 사용자에게 노출할 학원 이름입니다. */
  academyName: string;
}

/** 학생들의 위시리스트로 이동하는 학원 안내 카드를 렌더링합니다. */
export function AcademySection({ academyName }: AcademySectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-t1 text-fg-neutral font-bold">{academyName}</h2>
      <Link
        href="/feed"
        className="flex h-[148px] w-full items-center gap-12 overflow-hidden rounded-[20px] bg-[#fffedd] pl-4 text-left"
      >
        <span className="text-t3 text-fg-neutral w-[178px] shrink-0 px-[10px] font-medium">
          <span className="block">학생들의 위시리스트</span>
          <span className="block">보러가기</span>
        </span>
        <Image
          src={bannerImage}
          alt=""
          width={174}
          height={174}
          className="size-[174px] max-w-none shrink-0 object-cover"
        />
      </Link>
    </section>
  );
}
