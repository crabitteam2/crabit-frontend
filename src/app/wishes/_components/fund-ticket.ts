const STORAGE_PREFIX = "crabit.fund-ticket.";

const MARK = "1";

/** 금액 화면이 끊어 로딩 화면이 한 번만 쓰는 실행 표입니다. */
export interface FundTicket {
  /** 옮길 금액이며 양의 정수입니다. */
  readonly amount: number;
  /** 재시도에도 그대로 쓰는 멱등성 키입니다. */
  readonly idempotencyKey: string;
  /**
   * 처음 보낼 때 쓴 출발 위시 버전입니다.
   *
   * 새로고침하면 위시 버전이 이미 올라가 있어, 그때 값을 그대로 쓰지 않으면
   * 백엔드가 다른 요청으로 보고 거부합니다.
   */
  readonly sourceVersion?: number;
  /** 처음 보낼 때 쓴 도착 위시 버전입니다. 위시 간 이동에만 있습니다. */
  readonly destinationVersion?: number;
}

/** 금액 화면이 끊은 표를 로딩 화면이 찾을 수 있게 보관합니다. */
export function putFundTicket(name: string, ticket: FundTicket) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(ticket));
  } catch {
    // 저장소를 쓸 수 없으면 표가 없는 것으로 보고 금액 화면으로 되돌아간다.
  }
}

/** 표가 남아 있는지만 보고 지우지 않습니다. */
export function peekFundTicket(name: string): FundTicket | null {
  return readTicket(name, false);
}

/** 값 없이 이 화면을 거쳤다는 사실만 남깁니다. */
export function putFlowMark(name: string) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + name, MARK);
  } catch {
    // 저장소를 쓸 수 없으면 표가 없는 것으로 보고 앞 화면으로 되돌아간다.
  }
}

/** 앞 화면을 거쳤는지 확인하며 표는 남겨둡니다. */
export function hasFlowMark(name: string) {
  try {
    return sessionStorage.getItem(STORAGE_PREFIX + name) === MARK;
  } catch {
    return false;
  }
}

/**
 * 표를 꺼내면서 지웁니다.
 *
 * 주소로 직접 들어왔거나 이미 쓴 표면 null이라 요청을 보내지 않습니다.
 */
export function takeFundTicket(name: string): FundTicket | null {
  return readTicket(name, true);
}

/** 다 쓴 표를 지웁니다. 결과를 받은 뒤에 부릅니다. */
export function clearFundTicket(name: string) {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + name);
  } catch {
    // 저장소를 쓸 수 없으면 지울 표도 없다.
  }
}

function readTicket(name: string, consume: boolean): FundTicket | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + name);
    if (consume) sessionStorage.removeItem(STORAGE_PREFIX + name);
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
    ticket.idempotencyKey !== "" &&
    isVersion(ticket.sourceVersion) &&
    isVersion(ticket.destinationVersion)
  );
}

function isVersion(value: unknown) {
  return (
    value === undefined ||
    (typeof value === "number" && Number.isSafeInteger(value))
  );
}
