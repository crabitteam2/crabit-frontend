/** 주간·월간 저축 리포트 미리보기 카드를 가로 스크롤 영역으로 표시합니다. */
export function RecapSection() {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-t1 text-fg-neutral font-bold">
        리플레이: 저축 리포트
      </h2>
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4">
        <article className="flex h-[300px] w-60 shrink-0 flex-col items-start gap-[68px] overflow-hidden rounded-[20px] bg-[linear-gradient(142deg,var(--color-pink-2)_3%,var(--color-pink-6)_100%)] px-4 py-[60px] [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.15))]">
          <p className="text-t3 text-static-white h-28 shrink-0 px-[10px] font-semibold">
            <span className="block">주간 요약을</span>
            <span className="block">확인하고</span>
            <span className="block">이번 주 계획을</span>
            <span className="block">세워보세요.</span>
          </p>
          <div className="text-static-white w-[178px] shrink-0">
            <p className="px-[10px] text-[14px] leading-[23px] font-semibold tracking-[-0.3px]">
              주간 리플레이
            </p>
            <p className="px-[10px] text-[11px] leading-[23px] tracking-[-0.3px]">
              지난주 동안 내가 가장 많이 한 행동은?
            </p>
          </div>
        </article>
        <article className="flex h-[300px] w-60 shrink-0 flex-col items-start gap-11 overflow-hidden rounded-[20px] bg-[linear-gradient(142deg,var(--color-pink-10)_3%,var(--color-pink-6)_100%)] px-4 py-[60px] [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.15))]">
          <p className="text-h1 text-static-white h-10 shrink-0 px-[10px] font-bold">
            Replay
          </p>
          <p className="text-static-white h-10 shrink-0 px-[10px] text-[96px] leading-[40px] font-bold tracking-[-0.3px]">
            7월
          </p>
        </article>
      </div>
    </section>
  );
}
