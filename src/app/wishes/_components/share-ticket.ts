const STORAGE_PREFIX = "crabit.share-ticket.";

/** 공개 대상 화면에서 고를 수 있는 공개 범위입니다. */
export type ShareVisibility = "ACADEMY" | "FOLLOWERS" | "PRIVATE";

const VISIBILITIES: readonly string[] = ["ACADEMY", "FOLLOWERS", "PRIVATE"];

/** 글쓰기 화면이 고른 공개 범위를 로딩 화면이 찾을 수 있게 보관합니다. */
export function putShareTicket(name: string, visibility: ShareVisibility) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + name, visibility);
  } catch {
    // 저장소를 쓸 수 없으면 표가 없는 것으로 보고 글쓰기 화면으로 되돌아간다.
  }
}

/** 표가 남아 있는지 보며 지우지 않습니다. */
export function peekShareTicket(name: string): ShareVisibility | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + name);
    return raw !== null && VISIBILITIES.includes(raw)
      ? (raw as ShareVisibility)
      : null;
  } catch {
    return null;
  }
}

/** 공유를 마친 표를 지웁니다. */
export function clearShareTicket(name: string) {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + name);
  } catch {
    // 저장소를 쓸 수 없으면 지울 표도 없다.
  }
}
