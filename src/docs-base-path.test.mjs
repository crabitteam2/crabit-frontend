import { describe, expect, it } from "vitest";
import { readDocsBasePath } from "../scripts/docs-base-path.mjs";

describe("readDocsBasePath", () => {
  it.each(["/", "/crabit-frontend/", "/preview/pr-15/"])(
    "허용된 절대 경로 %s를 유지한다",
    (basePath) => {
      expect(readDocsBasePath(["--base-path", basePath])).toBe(basePath);
    },
  );

  it("인자가 없으면 저장소 배포 경로를 사용한다", () => {
    expect(readDocsBasePath([])).toBe("/crabit-frontend/");
  });

  it.each([
    "",
    "crabit-frontend/",
    "/crabit-frontend",
    "//crabit-frontend/",
    "/../crabit-frontend/",
  ])("위험하거나 모호한 경로 %s를 거부한다", (basePath) => {
    expect(() => readDocsBasePath(["--base-path", basePath])).toThrow(
      "--base-path must be / or a safe absolute path ending in /",
    );
  });

  it("옵션 값이 누락되면 거부한다", () => {
    expect(() => readDocsBasePath(["--base-path"])).toThrow(
      "--base-path must be / or a safe absolute path ending in /",
    );
  });
});
