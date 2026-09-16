import { FundMovementHistory } from "./history-screen";
import { recentThreeMonthBounds } from "./history-model";

export default async function FundMovementHistoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const accountId = typeof query.accountId === "string" ? query.accountId : "";
  return (
    <FundMovementHistory
      key={accountId}
      accountId={accountId}
      initialBounds={recentThreeMonthBounds()}
    />
  );
}
