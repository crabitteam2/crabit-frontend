import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { readBffEnvironment } from "@/config/env";
import { readPersonaTokenConfiguration } from "@/config/persona-tokens";
import { resolveRequestPersona } from "@/lib/persona/cookies";
import { loadAccountContext } from "@/app/wishes/load-account";

export default async function DemoPage() {
  const environment = readBffEnvironment();
  if (environment.backendProfile !== "demo") notFound();
  const persona = resolveRequestPersona(new Headers(await headers()), "demo");
  const tokens = readPersonaTokenConfiguration("demo");
  const selected =
    persona &&
    (persona === "owner" || persona.startsWith("grade-")) &&
    tokens.active?.[persona];
  const context = selected ? await loadAccountContext() : null;
  return (
    <main className="space-y-5 px-4 py-8">
      <h1 className="text-2xl font-bold">데모 계정</h1>
      {context && persona ? (
        <>
          <h2 className="text-lg font-semibold">
            {persona === "owner"
              ? "기본 Owner"
              : `${persona.slice(-1)}학년 대표`}
          </h2>
          <dl className="space-y-2 text-sm break-all">
            <dt>계좌</dt>
            <dd data-testid="demo-account-id">
              {context.cardBalanceAccountId}
            </dd>
            <dt>학원</dt>
            <dd>{context.account.academyId}</dd>
            <dt>최근 확인한 카드 잔액</dt>
            <dd>
              {context.account.actualCardBalance === null
                ? "확인 전"
                : `${context.account.actualCardBalance.toLocaleString("ko-KR")}원`}
            </dd>
          </dl>
          <nav aria-label="대표 화면" className="flex flex-wrap gap-4">
            <Link prefetch={false} className="underline" href="/home">
              홈
            </Link>
            <Link prefetch={false} className="underline" href="/wishes">
              위시
            </Link>
            <Link prefetch={false} className="underline" href="/feed">
              피드
            </Link>
            <Link
              prefetch={false}
              className="underline"
              href="/recaps/weekly?weekStart=2026-08-31"
            >
              주간 리캡
            </Link>
            <Link
              prefetch={false}
              className="underline"
              href="/recaps/monthly?month=2026-08"
            >
              월간 리캡
            </Link>
          </nav>
        </>
      ) : (
        <p>
          위에서 Owner 또는 학년 대표를 선택하면 실제 계좌와 제품 화면을 확인할
          수 있어요.
        </p>
      )}
    </main>
  );
}
