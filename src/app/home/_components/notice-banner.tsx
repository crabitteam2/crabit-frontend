import Image from "next/image";
import bannerImage from "@/../public/images/home/notice-banner.png";

/** 학원 공지 배너를 표시합니다. */
export function NoticeBanner() {
  return (
    <div className="flex items-center justify-center overflow-hidden rounded-[15px] bg-[rgba(88,136,255,0.3)] px-8 py-2">
      <div className="relative h-[82px] w-[269px] max-w-full overflow-hidden">
        <Image
          src={bannerImage}
          alt="기말고사 대비 특별 관리 시스템 안내"
          width={317}
          height={122}
          className="absolute top-[-24px] left-[-47.5px] max-w-none"
        />
      </div>
    </div>
  );
}
