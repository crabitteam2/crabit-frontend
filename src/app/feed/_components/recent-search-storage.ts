const STORAGE_KEY = "crabit:recent-student-searches";

const MAX_KEPT = 10;

/**
 * 브라우저에 남긴 최근 검색어를 읽습니다.
 *
 * 저장 API가 없어 이 기기에만 남으며, 저장소를 쓸 수 없으면 빈 목록입니다.
 */
export function readRecentSearches(): string[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "null",
    );
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

/** 최근 검색어를 덮어 씁니다. 저장소를 쓸 수 없으면 조용히 넘어갑니다. */
export function saveRecentSearches(keywords: readonly string[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(keywords.slice(0, MAX_KEPT)),
    );
  } catch {
    return;
  }
}

/** 고른 검색어를 맨 앞으로 올리고 중복을 없앤 목록을 만듭니다. */
export function withRecentSearch(
  keywords: readonly string[],
  keyword: string,
): string[] {
  return [keyword, ...keywords.filter((item) => item !== keyword)].slice(
    0,
    MAX_KEPT,
  );
}
