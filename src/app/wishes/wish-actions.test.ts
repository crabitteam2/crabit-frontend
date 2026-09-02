import { beforeEach, describe, expect, it, vi } from "vitest";

const listMyCardBalanceAccounts = vi.fn();
const selectRepresentativeWish = vi.fn();
const abandonWish = vi.fn();
const deleteWish = vi.fn();
const completeWish = vi.fn();
const patchWish = vi.fn();
const depositToWish = vi.fn();
const withdrawFromWish = vi.fn();
const transferWishFunds = vi.fn();
const refreshCardBalance = vi.fn();
const revalidatePath = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ cookie: "crabit-e2e-persona=owner" }),
}));
vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));
vi.mock("@/lib/http/server", () => ({
  createServerApiClient: () => ({}),
}));
vi.mock("@/lib/http/card-balance-accounts", () => ({
  listMyCardBalanceAccounts: (...args: unknown[]) =>
    listMyCardBalanceAccounts(...args),
  refreshCardBalance: (...args: unknown[]) => refreshCardBalance(...args),
}));
vi.mock("@/lib/http/wishes", () => ({
  selectRepresentativeWish: (...args: unknown[]) =>
    selectRepresentativeWish(...args),
  abandonWish: (...args: unknown[]) => abandonWish(...args),
  deleteWish: (...args: unknown[]) => deleteWish(...args),
  completeWish: (...args: unknown[]) => completeWish(...args),
  patchWish: (...args: unknown[]) => patchWish(...args),
  depositToWish: (...args: unknown[]) => depositToWish(...args),
  withdrawFromWish: (...args: unknown[]) => withdrawFromWish(...args),
  transferWishFunds: (...args: unknown[]) => transferWishFunds(...args),
}));

const {
  abandonWishAction,
  completeWishAction,
  deleteWishAction,
  depositToWishAction,
  refreshCardBalanceAction,
  selectRepresentativeWishAction,
  shareWishAction,
  transferWishFundsAction,
  withdrawFromWishAction,
} = await import("./wish-actions");

const accountId = "11111111-1111-4111-8111-111111111111";
const wishId = "22222222-2222-4222-8222-222222222222";

function failure(code: string) {
  return {
    ok: false,
    error: { kind: "backend", status: 409, code, message: code },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  listMyCardBalanceAccounts.mockResolvedValue({
    ok: true,
    data: { items: [{ cardBalanceAccountId: accountId }], nextCursor: null },
  });
  selectRepresentativeWish.mockResolvedValue({ ok: true, data: {} });
  abandonWish.mockResolvedValue({ ok: true, data: {} });
  deleteWish.mockResolvedValue({ ok: true, data: {} });
  completeWish.mockResolvedValue({ ok: true, data: {} });
  patchWish.mockResolvedValue({ ok: true, data: {} });
  depositToWish.mockResolvedValue({ ok: true, data: {} });
  withdrawFromWish.mockResolvedValue({ ok: true, data: {} });
  transferWishFunds.mockResolvedValue({ ok: true, data: {} });
  refreshCardBalance.mockResolvedValue({ ok: true, data: {} });
});

describe("위시 쓰기 액션", () => {
  it("대표 위시를 선택하고 목록을 다시 그리게 한다", async () => {
    await expect(selectRepresentativeWishAction(wishId)).resolves.toEqual({
      ok: true,
    });

    expect(selectRepresentativeWish).toHaveBeenCalledWith(expect.anything(), {
      cardBalanceAccountId: accountId,
      body: { wishId },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/wishes");
  });

  it("포기 요청에 기대 버전과 매번 새로운 멱등성 키를 싣는다", async () => {
    await expect(abandonWishAction(wishId, 4)).resolves.toEqual({ ok: true });
    await expect(abandonWishAction(wishId, 4)).resolves.toEqual({ ok: true });

    const [first, second] = abandonWish.mock.calls.map(
      ([, options]) => options,
    );
    expect(first).toMatchObject({
      cardBalanceAccountId: accountId,
      wishId,
      body: { expectedVersion: 4 },
    });
    expect(first.idempotencyKey).not.toBe(second.idempotencyKey);
    expect(revalidatePath).toHaveBeenCalledWith(`/wishes/${wishId}`);
  });

  it("삭제 요청은 기대 버전을 If-Match로 보낸다", async () => {
    await expect(deleteWishAction(wishId, 9)).resolves.toEqual({ ok: true });

    expect(deleteWish).toHaveBeenCalledWith(expect.anything(), {
      cardBalanceAccountId: accountId,
      wishId,
      idempotencyKey: expect.any(String),
      ifMatch: 9,
    });
  });

  it.each([
    [
      "VERSION_CONFLICT",
      "위시 정보가 바뀌었어요. 새로고침한 뒤 다시 시도해주세요.",
    ],
    ["INVALID_STATE_TRANSITION", "지금은 처리할 수 없는 위시예요."],
    ["WISH_NOT_FOUND", "이미 사라진 위시예요."],
    ["BALANCE_MISMATCH_LOCKED", "잔액 조정을 끝낸 뒤에 다시 시도해주세요."],
    ["FORBIDDEN", "잠시 후 다시 시도해주세요."],
  ])(
    "실패한 %s는 화면 문구로 바꾸고 다시 그리지 않는다",
    async (code, message) => {
      abandonWish.mockResolvedValue(failure(code));

      await expect(abandonWishAction(wishId, 4)).resolves.toEqual({
        ok: false,
        message,
      });
      expect(revalidatePath).not.toHaveBeenCalled();
    },
  );

  it("완료 요청에 기대 버전과 멱등성 키를 싣는다", async () => {
    await expect(completeWishAction(wishId, 5)).resolves.toEqual({ ok: true });

    expect(completeWish).toHaveBeenCalledWith(expect.anything(), {
      cardBalanceAccountId: accountId,
      wishId,
      idempotencyKey: expect.any(String),
      body: { expectedVersion: 5 },
    });
    expect(revalidatePath).toHaveBeenCalledWith(`/wishes/${wishId}`);
  });

  it("공유는 공개 범위를 merge patch 로 보낸다", async () => {
    await expect(shareWishAction(wishId, 7, "ACADEMY")).resolves.toEqual({
      ok: true,
    });

    expect(patchWish).toHaveBeenCalledWith(expect.anything(), {
      cardBalanceAccountId: accountId,
      wishId,
      body: { expectedVersion: 7, visibility: "ACADEMY" },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/feed");
  });

  it("완료할 수 없는 상태면 화면 문구로 바꾼다", async () => {
    completeWish.mockResolvedValue(failure("INVALID_STATE_TRANSITION"));

    await expect(completeWishAction(wishId, 5)).resolves.toEqual({
      ok: false,
      message: "지금은 처리할 수 없는 위시예요.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
  it("입금 요청에 금액, 기대 버전, 화면이 준 멱등성 키를 싣는다", async () => {
    await expect(
      depositToWishAction({
        wishId,
        expectedVersion: 3,
        amount: 5_000,
        idempotencyKey: "key-1",
      }),
    ).resolves.toEqual({ ok: true });

    expect(depositToWish).toHaveBeenCalledWith(expect.anything(), {
      cardBalanceAccountId: accountId,
      wishId,
      idempotencyKey: "key-1",
      body: { amount: 5_000, expectedVersion: 3 },
    });
    expect(revalidatePath).toHaveBeenCalledWith(`/wishes/${wishId}`);
  });

  it("출금 요청에 금액, 기대 버전, 화면이 준 멱등성 키를 싣는다", async () => {
    await expect(
      withdrawFromWishAction({
        wishId,
        expectedVersion: 7,
        amount: 2_000,
        idempotencyKey: "key-2",
      }),
    ).resolves.toEqual({ ok: true });

    expect(withdrawFromWish).toHaveBeenCalledWith(expect.anything(), {
      cardBalanceAccountId: accountId,
      wishId,
      idempotencyKey: "key-2",
      body: { amount: 2_000, expectedVersion: 7 },
    });
  });

  it("이체 요청은 양쪽 위시의 기대 버전을 함께 보내고 두 상세를 다시 그리게 한다", async () => {
    const otherWishId = "33333333-3333-4333-8333-333333333333";

    await expect(
      transferWishFundsAction({
        sourceWishId: wishId,
        destinationWishId: otherWishId,
        amount: 1_000,
        sourceExpectedVersion: 2,
        destinationExpectedVersion: 5,
        idempotencyKey: "key-3",
      }),
    ).resolves.toEqual({ ok: true });

    expect(transferWishFunds).toHaveBeenCalledWith(expect.anything(), {
      cardBalanceAccountId: accountId,
      idempotencyKey: "key-3",
      body: {
        sourceWishId: wishId,
        destinationWishId: otherWishId,
        amount: 1_000,
        sourceExpectedVersion: 2,
        destinationExpectedVersion: 5,
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith(`/wishes/${wishId}`);
    expect(revalidatePath).toHaveBeenCalledWith(`/wishes/${otherWishId}`);
  });

  it("입금 실패는 코드에 맞는 문구를 돌려주고 다시 그리지 않는다", async () => {
    depositToWish.mockResolvedValue(failure("INSUFFICIENT_AVAILABLE_BALANCE"));

    await expect(
      depositToWishAction({
        wishId,
        expectedVersion: 3,
        amount: 5_000,
        idempotencyKey: "key-4",
      }),
    ).resolves.toEqual({
      ok: false,
      message: "카드에 남은 금액보다 많아요. 금액을 다시 확인해주세요.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("잔액 새로고침은 계좌 식별자만 보내고 경로를 다시 그리지 않는다", async () => {
    await expect(refreshCardBalanceAction()).resolves.toEqual({ ok: true });

    expect(refreshCardBalance).toHaveBeenCalledWith(expect.anything(), {
      cardBalanceAccountId: accountId,
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
