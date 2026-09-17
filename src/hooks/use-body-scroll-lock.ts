"use client";

import { useEffect } from "react";

let locks = 0;
let restored = "";

/**
 * 열려 있는 동안 화면 스크롤을 막습니다.
 *
 * 시트와 다이얼로그가 겹쳐 열릴 수 있어 건 횟수를 셉니다. 각자 이전 값을 기억했다
 * 되돌리면 겹친 쪽이 `hidden`을 이전 값으로 기억해 마지막에 그 값이 남는다.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    if (locks === 0) {
      restored = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    locks += 1;

    return () => {
      locks -= 1;
      if (locks === 0) document.body.style.overflow = restored;
    };
  }, [isLocked]);
}
