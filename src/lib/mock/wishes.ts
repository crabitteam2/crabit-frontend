export type WishState =
  | "IN_PROGRESS"
  | "AMOUNT_REACHED"
  | "COMPLETED"
  | "ABANDONED";

export interface Wish {
  id: string;
  purpose: string;
  amount: number;
  targetAmount: number;
  state: WishState;
  startDate: string;
  targetDate: string;
}

export interface FundMovement {
  id: string;
  occurredAt: Date;
  kind: "DEPOSIT" | "WITHDRAWAL";
  amount: number;
  balanceAfter: number;
}

export interface WishListData {
  inProgress: Wish[];
  finished: Wish[];
}

const wishes: Wish[] = [
  {
    id: "w1",
    purpose: "산리오 스티커 세트",
    amount: 12_000,
    targetAmount: 30_000,
    state: "IN_PROGRESS",
    startDate: "26.06.01",
    targetDate: "26.10.31",
  },
  {
    id: "w2",
    purpose: "엄마 생신 선물",
    amount: 6_500,
    targetAmount: 50_000,
    state: "IN_PROGRESS",
    startDate: "26.07.15",
    targetDate: "26.09.30",
  },
  {
    id: "w3",
    purpose: "시나모롤 인형",
    amount: 4_500,
    targetAmount: 30_000,
    state: "IN_PROGRESS",
    startDate: "26.08.24",
    targetDate: "26.10.25",
  },
  {
    id: "w4",
    purpose: "문구점 색연필 세트",
    amount: 8_500,
    targetAmount: 10_000,
    state: "IN_PROGRESS",
    startDate: "26.05.02",
    targetDate: "26.09.15",
  },
  {
    id: "w5",
    purpose: "친구 생일 선물",
    amount: 9_000,
    targetAmount: 30_000,
    state: "IN_PROGRESS",
    startDate: "26.08.01",
    targetDate: "26.11.15",
  },
  {
    id: "w6",
    purpose: "축구공",
    amount: 25_000,
    targetAmount: 25_000,
    state: "AMOUNT_REACHED",
    startDate: "26.06.10",
    targetDate: "26.08.31",
  },
  {
    id: "w7",
    purpose: "스포츠카 레고",
    amount: 45_000,
    targetAmount: 45_000,
    state: "COMPLETED",
    startDate: "26.01.05",
    targetDate: "26.05.31",
  },
  {
    id: "w8",
    purpose: "슬라임 만들기 키트",
    amount: 6_000,
    targetAmount: 15_000,
    state: "ABANDONED",
    startDate: "26.02.11",
    targetDate: "26.04.30",
  },
  {
    id: "w9",
    purpose: "캐릭터 필통",
    amount: 18_000,
    targetAmount: 18_000,
    state: "COMPLETED",
    startDate: "26.03.02",
    targetDate: "26.06.30",
  },
  {
    id: "w10",
    purpose: "놀이공원 입장권",
    amount: 12_000,
    targetAmount: 55_000,
    state: "ABANDONED",
    startDate: "26.04.01",
    targetDate: "26.07.31",
  },
];

const FINISHED_STATES: readonly WishState[] = ["COMPLETED", "ABANDONED"];

export function isFinishedWish(wish: Wish) {
  return FINISHED_STATES.includes(wish.state);
}

const movements: FundMovement[] = [
  {
    id: "m1",
    occurredAt: new Date("2026-08-10T14:31:05+09:00"),
    kind: "DEPOSIT",
    amount: 1_500,
    balanceAfter: 4_500,
  },
  {
    id: "m2",
    occurredAt: new Date("2026-08-07T09:12:44+09:00"),
    kind: "DEPOSIT",
    amount: 1_000,
    balanceAfter: 3_000,
  },
  {
    id: "m3",
    occurredAt: new Date("2026-08-03T21:05:18+09:00"),
    kind: "WITHDRAWAL",
    amount: 500,
    balanceAfter: 2_000,
  },
  {
    id: "m4",
    occurredAt: new Date("2026-08-01T08:40:02+09:00"),
    kind: "DEPOSIT",
    amount: 1_500,
    balanceAfter: 2_500,
  },
  {
    id: "m5",
    occurredAt: new Date("2026-07-28T18:22:31+09:00"),
    kind: "DEPOSIT",
    amount: 1_000,
    balanceAfter: 1_000,
  },
];

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(params: SearchParams, key: string) {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

function hoistRepresentative(list: Wish[], params: SearchParams) {
  const wishId = readParam(params, "representative");
  if (wishId === undefined) return list;

  const picked = list.filter((wish) => wish.id === wishId);
  if (picked.length === 0) return list;

  return [...picked, ...list.filter((wish) => wish.id !== wishId)];
}

export function resolveWishListData(params: SearchParams): WishListData {
  const list = readParam(params, "list");

  if (list === "empty") return { inProgress: [], finished: [] };

  const deletedId = readParam(params, "deleted");
  const kept = wishes.filter((w) => w.id !== deletedId);
  const inProgress = hoistRepresentative(
    kept.filter((w) => !FINISHED_STATES.includes(w.state)),
    params,
  );
  const finished = kept.filter((w) => FINISHED_STATES.includes(w.state));

  if (list === "in-progress-only") return { inProgress, finished: [] };
  if (list === "finished-only") return { inProgress: [], finished };

  return { inProgress, finished };
}

export function findWish(wishId: string): Wish | null {
  return wishes.find((wish) => wish.id === wishId) ?? null;
}

export function resolveMovements(params: SearchParams): FundMovement[] {
  if (readParam(params, "history") === "empty") return [];
  return [...movements].sort(
    (a, b) => b.occurredAt.getTime() - a.occurredAt.getTime(),
  );
}
