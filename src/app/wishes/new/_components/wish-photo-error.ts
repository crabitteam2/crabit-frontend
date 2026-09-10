import type { FrontendHttpError } from "@/lib/http/errors";

/** 정규화된 사진 흐름 오류를 사용자가 취할 수 있는 다음 행동으로 설명합니다. */
export function wishPhotoErrorMessage(code: FrontendHttpError["code"]) {
  switch (code) {
    case "PHOTO_TOO_LARGE":
    case "BFF_PAYLOAD_TOO_LARGE":
      return "사진 파일이 너무 커요.";
    case "UNSUPPORTED_PHOTO_TYPE":
    case "INVALID_PHOTO":
      return "사용할 수 없는 사진이에요. 다른 사진을 선택해주세요.";
    case "PHOTO_CONTENT_NOT_ALLOWED":
      return "이 사진은 위시에 사용할 수 없어요.";
    case "PHOTO_UPLOAD_RATE_LIMITED":
      return "사진 업로드 횟수를 초과했어요. 잠시 후 다시 시도해주세요.";
    case "BFF_REQUEST_TIMEOUT":
      return "사진 업로드 시간이 초과됐어요. 같은 사진으로 다시 시도해주세요.";
    case "PHOTO_PROCESSING_UNAVAILABLE":
    case "PHOTO_DELIVERY_UNAVAILABLE":
    case "NETWORK_ERROR":
    case "BFF_UPSTREAM_UNAVAILABLE":
      return "사진 서비스에 잠시 연결할 수 없어요. 다시 시도해주세요.";
    case "WISH_PHOTO_EXPIRED":
      return "사진 업로드 시간이 만료됐어요. 사진을 다시 선택해주세요.";
    case "WISH_PHOTO_ALREADY_ATTACHED":
      return "이미 다른 위시에 사용된 사진이에요.";
    default:
      return "위시를 만들지 못했어요. 입력을 확인하고 다시 시도해주세요.";
  }
}
