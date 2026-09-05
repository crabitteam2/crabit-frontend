import Link from "next/link";
import type { components } from "@/lib/http/generated/crabit-backend";

type WeeklyRecap = components["schemas"]["WeeklyRecapResponse"];
type MonthlyRecap = components["schemas"]["MonthlyRecapResponse"];

export function RecapPageShell({
  title,
  children,
}: {
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  return (
    <main className="min-h-[100svh] bg-white px-4 pb-[calc(48px+env(safe-area-inset-bottom))]">
      <header className="flex h-16 items-center gap-3">
        <Link href="/" className="text-fg-neutral text-[15px] font-semibold">
          ← 홈
        </Link>
        <h1 className="text-t1 text-fg-neutral font-bold">{title}</h1>
      </header>
      <div className="flex flex-col gap-4 pt-4">{children}</div>
    </main>
  );
}

export function WeeklyRecapDetail({ recap }: { readonly recap: WeeklyRecap }) {
  if (recap.status !== "SUCCEEDED" || recap.result === null) {
    return <RecapState kind="주간" status={recap.status} />;
  }

  const {
    page1LastWeekPerformance,
    page2GrowthReport,
    page3AcademySuccessStories,
  } = recap.result;
  return (
    <>
      <DetailCard
        eyebrow="지난주 성과"
        title={page1LastWeekPerformance.achievement.message}
      >
        <Metric
          label="저축 횟수"
          value={`${page1LastWeekPerformance.achievement.saveCount}번`}
        />
        <Metric
          label="순저축"
          value={formatKrw(page1LastWeekPerformance.achievement.netSavings)}
        />
        <Metric
          label="새 위시"
          value={`${page1LastWeekPerformance.achievement.newWishCount}개`}
        />
        {page1LastWeekPerformance.milestone.message === null ? null : (
          <p>{page1LastWeekPerformance.milestone.message}</p>
        )}
        <p>{page1LastWeekPerformance.streak.message}</p>
      </DetailCard>

      <DetailCard eyebrow="성장 리포트" title={page2GrowthReport.messageVisits}>
        <Metric label="방문" value={`${page2GrowthReport.totalVisits}번`} />
        <Metric
          label="방문한 친구"
          value={`${page2GrowthReport.uniqueVisitors}명`}
        />
        {page2GrowthReport.messageGrowth === null ? null : (
          <p>{page2GrowthReport.messageGrowth}</p>
        )}
      </DetailCard>

      <DetailCard
        eyebrow="학원 성공 스토리"
        title={page3AcademySuccessStories.messageSummary}
      >
        {page3AcademySuccessStories.stories.map((story) => (
          <Link
            key={story.sharedCardId}
            href={`/feed/${story.ownerStudentId}`}
            data-shared-card-id={story.sharedCardId}
            data-wish-id={story.wishId}
            className="bg-bg-neutral-soft text-fg-neutral block rounded-2xl px-4 py-3 font-semibold"
          >
            {story.typeTitle ?? "친구의 저축 리플레이"} 보기
          </Link>
        ))}
      </DetailCard>
    </>
  );
}

export function MonthlyRecapDetail({
  recap,
}: {
  readonly recap: MonthlyRecap;
}) {
  if (recap.status !== "SUCCEEDED" || recap.result === null) {
    return <RecapState kind="월간" status={recap.status} />;
  }

  const result = recap.result;
  return (
    <>
      <DetailCard eyebrow="나의 저축 유형" title={result.typeSection.typeTitle}>
        <p>{result.typeSection.message}</p>
      </DetailCard>

      <DetailCard
        eyebrow="목표 성과"
        title={result.objectivePerformance.messageTotalSavings}
      >
        <p>{result.objectivePerformance.messageCompletedCount}</p>
        {result.objectivePerformance.messageRateChange === null ? null : (
          <p>{result.objectivePerformance.messageRateChange}</p>
        )}
      </DetailCard>

      <DetailCard
        eyebrow="저축 패턴"
        title={result.patternAnalysis.messageWeekWeekday}
      >
        <p>{result.patternAnalysis.messageRegularity}</p>
        <p>{result.patternAnalysis.messageAvgAmount}</p>
      </DetailCard>

      <DetailCard
        eyebrow="학원 친구와 비교"
        title={result.groupComparison.messageHabit}
      >
        {result.groupComparison.habitPercentile === null ? null : (
          <Metric
            label="저축 습관 백분위"
            value={`${result.groupComparison.habitPercentile}%`}
          />
        )}
        {result.groupComparison.messageAchievement === null ? null : (
          <p>{result.groupComparison.messageAchievement}</p>
        )}
        {result.groupComparison.achievementPercentile === null ? null : (
          <Metric
            label="목표 달성 백분위"
            value={`${result.groupComparison.achievementPercentile}%`}
          />
        )}
      </DetailCard>

      <DetailCard
        eyebrow="목표 페이스"
        title={result.pacePrediction.messageDailyPace}
      >
        {result.pacePrediction.messageExpectedDate === null ? null : (
          <p>{result.pacePrediction.messageExpectedDate}</p>
        )}
        {result.pacePrediction.messageRequiredDaily === null ? null : (
          <p>{result.pacePrediction.messageRequiredDaily}</p>
        )}
      </DetailCard>
    </>
  );
}

function DetailCard({
  eyebrow,
  title,
  children,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  return (
    <section className="bg-bg-neutral-soft text-fg-neutral flex flex-col gap-3 rounded-[20px] p-5">
      <p className="text-fg-neutral-muted text-[13px] font-semibold">
        {eyebrow}
      </p>
      <h2 className="text-[22px] leading-8 font-bold tracking-[-0.4px]">
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-[15px] leading-6">
        {children}
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <p className="flex items-center justify-between gap-4">
      <span className="text-fg-neutral-muted">{label}</span>
      <strong>{value}</strong>
    </p>
  );
}

function RecapState({
  kind,
  status,
}: {
  readonly kind: "주간" | "월간";
  readonly status: WeeklyRecap["status"] | MonthlyRecap["status"];
}) {
  const message =
    status === "GENERATING"
      ? `${kind} 리플레이를 만들고 있어요.`
      : status === "NOT_ELIGIBLE"
        ? "저축 기록이 3번 모이면 월간 리플레이가 열려요."
        : status === "FAILED"
          ? `${kind} 리플레이를 불러오지 못했어요.`
          : `아직 ${kind} 리플레이가 없어요.`;
  return (
    <section className="bg-bg-neutral-soft flex min-h-64 items-center justify-center rounded-[20px] px-6">
      <p className="text-fg-neutral-muted text-center text-[20px] leading-7 font-semibold">
        {message}
      </p>
    </section>
  );
}

function formatKrw(value: number) {
  return `${new Intl.NumberFormat("ko-KR").format(value)}원`;
}
