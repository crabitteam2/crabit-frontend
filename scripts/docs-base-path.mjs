/**
 * 문서 사이트가 배포될 절대 base path를 읽고 검증합니다.
 *
 * `/`는 로컬 정적 서버용이며, `/crabit-frontend/` 같은 하위 경로는
 * GitHub Pages와 같은 서브패스 배포용입니다.
 *
 * @param {readonly string[]} argv CLI 인자 목록
 * @param {string} [defaultValue] `--base-path`가 없을 때 사용할 값
 * @returns {string} 검증된 절대 base path
 */
export function readDocsBasePath(argv, defaultValue = "/crabit-frontend/") {
  const index = argv.indexOf("--base-path");
  const value = index < 0 ? defaultValue : argv[index + 1];
  const isRoot = value === "/";
  const isSafeSubpath =
    typeof value === "string" &&
    /^\/[A-Za-z0-9._/-]*\/$/.test(value) &&
    !value.includes("//") &&
    !value.includes("..");

  if (!isRoot && !isSafeSubpath) {
    throw new Error(
      "--base-path must be / or a safe absolute path ending in /",
    );
  }

  return value;
}
