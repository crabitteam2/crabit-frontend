import {
  MonthlyRecapDetail,
  RecapPageShell,
} from "../_components/recap-detail";
import { loadMonthlyRecap } from "../load-recap";

export default async function MonthlyRecapPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const month = first(query.month);
  const recap = await loadMonthlyRecap(month);
  return (
    <RecapPageShell title="월간 리플레이">
      <MonthlyRecapDetail recap={recap} />
    </RecapPageShell>
  );
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
