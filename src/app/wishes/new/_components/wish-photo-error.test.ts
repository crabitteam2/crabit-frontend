import { describe, expect, it } from "vitest";

import { normalizeErrorResponse } from "@/lib/http/errors";
import { wishPhotoErrorMessage } from "./wish-photo-error";

describe("Wish photo BFF error handling", () => {
  it.each([
    {
      status: 408,
      code: "BFF_REQUEST_TIMEOUT",
      sourceMessage: "BFF request timed out",
      retryable: true,
      userMessage:
        "사진 업로드 시간이 초과됐어요. 같은 사진으로 다시 시도해주세요.",
    },
    {
      status: 413,
      code: "BFF_PAYLOAD_TOO_LARGE",
      sourceMessage: "BFF request body is too large",
      retryable: false,
      userMessage: "사진 파일이 너무 커요.",
    },
  ] as const)(
    "normalizes $code and presents an actionable photo message",
    async ({ status, code, sourceMessage, retryable, userMessage }) => {
      const response = new Response(
        JSON.stringify({ code, message: sourceMessage }),
        {
          status,
          headers: { "Content-Type": "application/json" },
        },
      );

      const error = await normalizeErrorResponse(response);

      expect(error).toEqual({
        kind: "bff",
        status,
        code,
        message: sourceMessage,
        retryable,
      });
      expect(wishPhotoErrorMessage(error.code)).toBe(userMessage);
    },
  );
});
