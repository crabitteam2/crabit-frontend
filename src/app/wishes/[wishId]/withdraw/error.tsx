"use client";

import { FundFlowError } from "../../_components/fund-flow-error";

export default function WithdrawError({ reset }: { reset: () => void }) {
  return <FundFlowError title="돈 꺼내기" reset={reset} />;
}
