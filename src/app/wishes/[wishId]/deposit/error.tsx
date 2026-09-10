"use client";

import { FundFlowError } from "../../_components/fund-flow-error";

export default function DepositError({ reset }: { reset: () => void }) {
  return <FundFlowError title="돈 넣기" reset={reset} />;
}
