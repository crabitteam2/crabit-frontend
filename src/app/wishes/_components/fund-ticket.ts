const STORAGE_PREFIX = "crabit.fund-ticket.";

/** 금액 화면이 끊어 로딩 화면이 한 번만 쓰는 실행 표입니다. */
export interface FundTicket {
  /** 옮길 금액이며 양의 정수입니다. */
  readonly amount: number;
  /** 재시도에도 그대로 쓰는 멱등성 키입니다. */
  readonly idempotencyKey: string;
}

/** 금액 화면이 끊은 표를 로딩 화면이 찾을 수 있게 보관합니다. */
export function putFundTicket(name: string, ticket: FundTicket) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(ticket));
  } catch {
    // 저장소를 쓸 수 없으면 표가 없는 것으로 보고 금액 화면으로 되돌아간다.
  }
}

/**
 * 표를 꺼내면서 지웁니다.
 *
 * 주소로 직접 들어왔거나 이미 쓴 표면 null이라 요청을 보내지 않습니다.
 */
export function takeFundTicket(name: string): FundTicket | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + name);
    sessionStorage.removeItem(STORAGE_PREFIX + name);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    return isFundTicket(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isFundTicket(value: unknown): value is FundTicket {
  if (typeof value !== "object" || value === null) return false;

  const ticket = value as Partial<FundTicket>;
  return (
    typeof ticket.amount === "number" &&
    Number.isSafeInteger(ticket.amount) &&
    ticket.amount > 0 &&
    typeof ticket.idempotencyKey === "string" &&
    ticket.idempotencyKey !== ""
  );
}
