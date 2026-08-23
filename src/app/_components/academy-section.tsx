import Image from "next/image";
import bannerImage from "@/../public/images/home/academy-banner.png";

interface AcademySectionProps {
  academyName: string;
}

export function AcademySection({ academyName }: AcademySectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-t1 text-fg-neutral font-bold">{academyName}</h2>
      <button
        type="button"
        className="flex h-[148px] w-full items-center gap-12 overflow-hidden rounded-[20px] bg-[#fffedd] pl-4 text-left"
      >
        <span className="text-t3 text-fg-neutral w-[178px] shrink-0 px-[10px] font-medium">
          <span className="block">친구들의 위시리스트</span>
          <span className="block">보러가기</span>
        </span>
        <Image
          src={bannerImage}
          alt=""
          width={174}
          height={174}
          className="size-[174px] max-w-none shrink-0 object-cover"
        />
      </button>
    </section>
  );
}
