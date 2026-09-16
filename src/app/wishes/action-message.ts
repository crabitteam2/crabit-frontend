import type { FrontendHttpError } from "@/lib/http/errors";

const MESSAGES: Partial<Record<FrontendHttpError["code"], string>> = {
  VERSION_CONFLICT: "위시 정보가 바뀌었어요. 새로고침한 뒤 다시 시도해주세요.",
  INVALID_STATE_TRANSITION: "지금은 처리할 수 없는 위시예요.",
  WISH_NOT_FOUND: "이미 사라진 위시예요.",
  NETWORK_ERROR: "연결이 불안정해요. 잠시 후 다시 시도해주세요.",
  INSUFFICIENT_AVAILABLE_BALANCE:
    "카드에 남은 금액보다 많아요. 금액을 다시 확인해주세요.",
  INSUFFICIENT_WISH_AMOUNT:
    "위시에 모인 금액보다 많아요. 금액을 다시 확인해주세요.",
  TARGET_AMOUNT_EXCEEDED: "목표 금액을 넘게는 넣을 수 없어요.",
  BALANCE_SYNC_FAILED:
    "카드 잔액을 확인하지 못했어요. 잠시 후 다시 시도해주세요.",
  CROSS_ACCOUNT_TRANSFER_FORBIDDEN: "다른 카드의 위시로는 보낼 수 없어요.",
  IDEMPOTENCY_KEY_REUSED:
    "이미 처리한 요청이에요. 새로고침한 뒤 다시 시도해주세요.",
  INVALID_AMOUNT: "금액을 다시 확인해주세요.",
};

const FALLBACK_MESSAGE = "잠시 후 다시 시도해주세요.";

/** 실패한 요청의 오류 코드를 화면에 그대로 보여줄 문구로 바꿉니다. */
export function toActionMessage(code: FrontendHttpError["code"]) {
  return MESSAGES[code] ?? FALLBACK_MESSAGE;
}
