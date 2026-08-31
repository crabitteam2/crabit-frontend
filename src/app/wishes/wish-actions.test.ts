import { beforeEach, describe, expect, it, vi } from "vitest";

const listMyCardBalanceAccounts = vi.fn();
const selectRepresentativeWish = vi.fn();
const abandonWish = vi.fn();
const deleteWish = vi.fn();
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
}));
vi.mock("@/lib/http/wishes", () => ({
  selectRepresentativeWish: (...args: unknown[]) =>
    selectRepresentativeWish(...args),
  abandonWish: (...args: unknown[]) => abandonWish(...args),
  deleteWish: (...args: unknown[]) => deleteWish(...args),
}));

const { abandonWishAction, deleteWishAction, selectRepresentativeWishAction } =
  await import("./wish-actions");

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
    ["BALANCE_MISMATCH_LOCKED", "잠시 후 다시 시도해주세요."],
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
});
