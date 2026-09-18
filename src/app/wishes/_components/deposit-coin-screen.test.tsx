import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { DepositCoinScreen } from "./deposit-coin-screen";
import { putFundTicket } from "./fund-ticket";
const { replace, deposit, transfer, callbacks } = vi.hoisted(() => ({
  replace: vi.fn(),
  deposit: vi.fn(),
  transfer: vi.fn(),
  callbacks: [] as (() => void)[],
}));
vi.mock("next/navigation", () => {
  const router = { replace };
  return { useRouter: () => router };
});
vi.mock("next/image", () => ({ default: () => <span /> }));
vi.mock("../wish-actions", () => ({
  depositToWishAction: deposit,
  transferWishFundsAction: transfer,
}));
vi.mock("./coin-drop", () => ({
  CoinDrop: ({
    onDrop,
    disabled,
  }: {
    onDrop: () => void;
    disabled: boolean;
  }) => {
    callbacks.push(onDrop);
    return (
      <button disabled={disabled} onClick={onDrop}>
        drop
      </button>
    );
  },
}));
const props = {
  wishId: "destination",
  expectedVersion: 7,
  source: { kind: "card" as const },
  ticketName: "test-ticket",
  amountHref: "/amount",
};
beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  callbacks.length = 0;
});
function ticket() {
  putFundTicket("test-ticket", {
    amount: 1234,
    idempotencyKey: "same-ticket-key",
  });
}
it("disables missing tickets and returns to amount without a request", () => {
  render(<DepositCoinScreen {...props} />);
  expect(screen.getByRole("button")).toBeDisabled();
  expect(replace).toHaveBeenCalledWith("/amount");
  expect(deposit).not.toHaveBeenCalled();
});
it("guards duplicate callbacks while pending and preserves card payload and event navigation", async () => {
  ticket();
  let resolve!: (value: unknown) => void;
  deposit.mockReturnValue(
    new Promise((r) => {
      resolve = r;
    }),
  );
  render(<DepositCoinScreen {...props} />);
  const drop = callbacks.at(-1)!;
  act(() => {
    drop();
    drop();
  });
  expect(deposit).toHaveBeenCalledTimes(1);
  expect(deposit).toHaveBeenCalledWith({
    wishId: "destination",
    expectedVersion: 7,
    amount: 1234,
    idempotencyKey: "same-ticket-key",
  });
  expect(screen.getByRole("button")).toBeDisabled();
  await act(async () => resolve({ ok: true, eventId: "event-123" }));
  expect(replace).toHaveBeenCalledWith(
    "/wishes/destination/deposit/done?event=event-123",
  );
  act(() => {
    callbacks.at(-1)!();
  });
  expect(deposit).toHaveBeenCalledTimes(1);
});
it("preserves both transfer versions and shows the error screen for an ordinary error", async () => {
  ticket();
  transfer.mockResolvedValue({
    ok: false,
    message: "다시 시도해 주세요",
    code: "TEMPORARY",
  });
  render(
    <DepositCoinScreen
      {...props}
      source={{ kind: "wish", wishId: "source", version: 9, purpose: "책" }}
    />,
  );
  fireEvent.click(screen.getByRole("button"));
  expect(
    await screen.findByText("돈 넣기 중 오류가 발생했어요."),
  ).toBeInTheDocument();
  expect(screen.getByText("다시 시도해 주세요")).toBeInTheDocument();
  expect(transfer).toHaveBeenCalledTimes(1);
  expect(transfer.mock.calls[0][0]).toEqual({
    sourceWishId: "source",
    destinationWishId: "destination",
    amount: 1234,
    sourceExpectedVersion: 9,
    destinationExpectedVersion: 7,
    idempotencyKey: "same-ticket-key",
  });
  expect(replace).not.toHaveBeenCalled();
});
it("routes balance mismatch to adjustment and retains the lock", async () => {
  ticket();
  deposit.mockResolvedValue({
    ok: false,
    code: "BALANCE_MISMATCH_LOCKED",
    message: "잔액 확인",
  });
  render(<DepositCoinScreen {...props} />);
  fireEvent.click(screen.getByRole("button"));
  await waitFor(() => expect(replace).toHaveBeenCalledWith("/adjust"));
  act(() => {
    callbacks.at(-1)!();
  });
  expect(deposit).toHaveBeenCalledTimes(1);
});
