import { Badge } from "@/components/ui/badge";

/** 홈 상단에 표시할 사용자와 대표 위시 정보입니다. */
interface HomeHeaderProps {
  /** 사용자 닉네임입니다. */
  nickname: string;
  /** 대표 위시 목적이며, 없으면 빈 상태 문구를 표시합니다. */
  wishPurpose: string | null;
}

/** 닉네임과 대표 위시 목적을 캐릭터 영역 위에 표시합니다. */
export function HomeHeader({ nickname, wishPurpose }: HomeHeaderProps) {
  return (
    <header className="flex flex-col gap-2 px-4 pt-[max(78px,calc(env(safe-area-inset-top)+18px))]">
      <div className="flex items-center gap-[10px]">
        <p className="text-t3 text-static-white font-medium [text-shadow:0_4px_8px_rgba(0,0,0,0.15)]">
          {nickname}의 위시
        </p>
        <Badge className="bg-pink-2 text-pink-6">대표</Badge>
      </div>
      <p className="text-t1 text-static-white font-bold [text-shadow:0_4px_8px_rgba(0,0,0,0.15)]">
        {wishPurpose ?? "대표위시가 비어있어요."}
      </p>
    </header>
  );
}
