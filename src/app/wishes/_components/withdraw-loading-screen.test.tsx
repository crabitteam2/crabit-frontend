import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { peekFundTicket, putFundTicket } from "./fund-ticket";
import { WithdrawLoadingScreen } from "./withdraw-loading-screen";

const { replace, withdraw, transfer } = vi.hoisted(() => ({
  replace: vi.fn(),
  withdraw: vi.fn(),
  transfer: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
vi.mock("../wish-actions", () => ({
  withdrawFromWishAction: withdraw,
  transferWishFundsAction: transfer,
}));
vi.mock("./loading-screen", () => ({
  LoadingScreen: ({ onFinish }: { onFinish: () => void }) => {
    onFinish();
    return <span>돈 꺼내는 중</span>;
  },
}));

const props = {
  wishId: "source",
  expectedVersion: 7,
  destination: { kind: "card" as const },
  ticketName: "withdraw:source",
  amountHref: "/amount",
  doneHref: "/done",
};

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

function ticket(extra: Record<string, unknown> = {}) {
  putFundTicket("withdraw:source", {
    amount: 3000,
    idempotencyKey: "same-key",
    ...extra,
  });
}

it("표가 없으면 요청 없이 금액 화면으로 되돌린다", () => {
  render(<WithdrawLoadingScreen {...props} />);

  expect(withdraw).not.toHaveBeenCalled();
  expect(replace).toHaveBeenCalledWith("/amount");
});

it("처음 보낼 때 쓴 버전을 표에 남긴다", async () => {
  ticket();
  withdraw.mockResolvedValue({ ok: true, eventId: "event-1" });
  render(<WithdrawLoadingScreen {...props} />);

  await waitFor(() =>
    expect(replace).toHaveBeenCalledWith("/done?event=event-1"),
  );
  expect(withdraw.mock.calls[0][0]).toEqual({
    wishId: "source",
    expectedVersion: 7,
    amount: 3000,
    idempotencyKey: "same-key",
  });
});

it("새로고침해도 처음 버전으로 다시 보내 결과 화면으로 간다", async () => {
  ticket({ sourceVersion: 7 });
  withdraw.mockResolvedValue({ ok: true, eventId: "event-1" });
  render(<WithdrawLoadingScreen {...props} expectedVersion={8} />);

  await waitFor(() =>
    expect(replace).toHaveBeenCalledWith("/done?event=event-1"),
  );
  expect(withdraw.mock.calls[0][0].expectedVersion).toBe(7);
  expect(peekFundTicket("withdraw:source")).toBeNull();
});

it("실패해도 표를 지워 같은 요청이 남지 않게 한다", async () => {
  ticket();
  withdraw.mockResolvedValue({
    ok: false,
    code: "VERSION_CONFLICT",
    message: "위시 정보가 바뀌었어요.",
  });
  render(<WithdrawLoadingScreen {...props} />);

  expect(
    await screen.findByText("돈 꺼내기 중 오류가 발생했어요."),
  ).toBeInTheDocument();
  expect(peekFundTicket("withdraw:source")).toBeNull();
});
