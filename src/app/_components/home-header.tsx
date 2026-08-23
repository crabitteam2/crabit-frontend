interface HomeHeaderProps {
  nickname: string;
  wishPurpose: string | null;
}

export function HomeHeader({ nickname, wishPurpose }: HomeHeaderProps) {
  return (
    <header className="flex flex-col gap-2 px-4 pt-[max(78px,calc(env(safe-area-inset-top)+18px))] [text-shadow:0_4px_8px_rgba(0,0,0,0.15)]">
      <p className="text-t3 text-static-white font-medium">
        {nickname}의 위시리스트
      </p>
      <p className="text-t1 text-static-white font-bold">
        {wishPurpose ?? "대표위시가 비어있어요."}
      </p>
    </header>
  );
}
