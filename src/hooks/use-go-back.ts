"use client";

import { useRouter } from "next/navigation";

/**
 * 기록의 이전 화면으로 돌아가는 처리를 만듭니다.
 *
 * 기록이 없이 주소로 바로 들어왔으면 `fallbackHref`로 갑니다.
 * `usesHref`를 주면 기록 대신 항상 `fallbackHref`로 가며, 입력한 값을 주소에 실어
 * 되돌아가는 단계 화면에서 씁니다.
 */
export function useGoBack(fallbackHref: string, usesHref = false) {
  const router = useRouter();

  return () => {
    if (!usesHref && window.history.length > 1) {
      router.back();
      return;
    }
    router.replace(fallbackHref);
  };
}
