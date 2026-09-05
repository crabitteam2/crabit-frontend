import { RecapPageShell, WeeklyRecapDetail } from "../_components/recap-detail";
import { loadWeeklyRecap } from "../load-recap";

export default async function WeeklyRecapPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const weekStart = first(query.weekStart);
  const recap = await loadWeeklyRecap(weekStart);
  return (
    <RecapPageShell title="주간 리플레이">
      <WeeklyRecapDetail recap={recap} />
    </RecapPageShell>
  );
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
