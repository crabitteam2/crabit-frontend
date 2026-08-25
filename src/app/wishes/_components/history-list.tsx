import type { FundMovement } from "@/lib/mock/wishes";

const TIME_ZONE = "Asia/Seoul";

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function toParts(date: Date) {
  const entries = formatter
    .formatToParts(date)
    .map((part) => [part.type, part.value] as const);
  return Object.fromEntries(entries) as Record<string, string>;
}

function toMonthKey(parts: Record<string, string>) {
  return `${parts.year}년 ${Number(parts.month)}월`;
}

function toOccurredLabel(parts: Record<string, string>) {
  const date = `${Number(parts.month)}월 ${Number(parts.day)}일`;
  return `${date} · ${parts.hour} : ${parts.minute} : ${parts.second}`;
}

interface HistoryListProps {
  movements: FundMovement[];
}

export function HistoryList({ movements }: HistoryListProps) {
  const months: { key: string; items: FundMovement[] }[] = [];
  for (const movement of movements) {
    const key = toMonthKey(toParts(movement.occurredAt));
    const last = months.at(-1);
    if (last?.key === key) last.items.push(movement);
    else months.push({ key, items: [movement] });
  }
  if (months.length === 0) {
    months.push({ key: toMonthKey(toParts(new Date())), items: [] });
  }

  return (
    <div className="flex flex-col gap-6">
      {months.map((month) => (
        <section key={month.key}>
          <h2 className="text-t3 text-fg-neutral px-4 py-[9px] font-medium">
            {month.key}
          </h2>
          <ul className="flex flex-col gap-6">
            {month.items.map((movement) => {
              const parts = toParts(movement.occurredAt);
              const isDeposit = movement.kind === "DEPOSIT";
              return (
                <li
                  key={movement.id}
                  className="flex h-10 items-center justify-between px-4 tracking-[-0.3px]"
                >
                  <span className="text-[16px] leading-[23px] text-[#17171c]">
                    {toOccurredLabel(parts)}
                  </span>
                  <span className="flex flex-col items-end text-right">
                    <span
                      className={`font-semibold ${isDeposit ? "text-pink-6" : "text-fg-neutral"}`}
                    >
                      <span className="text-[16px] leading-[23px]">
                        {isDeposit ? "+" : "-"}
                        {movement.amount.toLocaleString("ko-KR")}
                      </span>
                      <span className="text-[14px] leading-[23px]">
                        &nbsp;원
                      </span>
                    </span>
                    <span className="text-fg-neutral text-[11px] leading-4">
                      합계 {movement.balanceAfter.toLocaleString("ko-KR")} 원
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
