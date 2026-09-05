// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import {
  readRecentSearches,
  saveRecentSearches,
  withRecentSearch,
} from "./recent-search-storage";

beforeEach(() => localStorage.clear());

describe("최근 검색어 저장", () => {
  it("저장한 순서 그대로 읽는다", () => {
    saveRecentSearches(["아라", "선형"]);

    expect(readRecentSearches()).toEqual(["아라", "선형"]);
  });

  it("저장한 적이 없으면 빈 목록이다", () => {
    expect(readRecentSearches()).toEqual([]);
  });

  it("문자열이 아닌 값이 섞여 있으면 걸러낸다", () => {
    localStorage.setItem(
      "crabit:recent-student-searches",
      JSON.stringify(["아라", 3, null]),
    );

    expect(readRecentSearches()).toEqual(["아라"]);
  });

  it("형식이 깨져 있으면 빈 목록이다", () => {
    localStorage.setItem("crabit:recent-student-searches", "{");

    expect(readRecentSearches()).toEqual([]);
  });

  it("열 개까지만 남긴다", () => {
    saveRecentSearches(
      Array.from({ length: 12 }, (_, index) => `학생${index}`),
    );

    expect(readRecentSearches()).toHaveLength(10);
  });
});

describe("최근 검색어 목록 만들기", () => {
  it("고른 검색어를 맨 앞으로 올린다", () => {
    expect(withRecentSearch(["아라", "선형"], "선형")).toEqual([
      "선형",
      "아라",
    ]);
  });

  it("새 검색어를 앞에 붙인다", () => {
    expect(withRecentSearch(["아라"], "도윤")).toEqual(["도윤", "아라"]);
  });

  it("열 개를 넘기지 않는다", () => {
    const keywords = Array.from({ length: 10 }, (_, index) => `학생${index}`);

    expect(withRecentSearch(keywords, "새 검색")).toHaveLength(10);
  });
});
