import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readDocsBasePath } from "./docs-base-path.mjs";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputRoot = path.join(repositoryRoot, "dist", "docs");

async function requireFile(relativePath) {
  const absolutePath = path.join(outputRoot, relativePath);
  await access(absolutePath);
  return readFile(absolutePath, "utf8");
}

const basePath = readDocsBasePath(process.argv.slice(2));
const rootIndex = await requireFile("index.html");
await requireFile("storybook/index.html");
await requireFile("api/index.html");
await requireFile(".nojekyll");

for (const target of ["storybook/", "api/"]) {
  const expectedHref = `href="${basePath}${target}"`;
  if (!rootIndex.includes(expectedHref)) {
    throw new Error(`Documentation index is missing ${expectedHref}`);
  }
}

if (rootIndex.includes("__DOCS_BASE_PATH__")) {
  throw new Error("Documentation index contains an unresolved base-path token");
}

const generatedEntries = (await readdir(outputRoot)).sort();
for (const expectedEntry of [".nojekyll", "api", "index.html", "storybook"]) {
  if (!generatedEntries.includes(expectedEntry)) {
    throw new Error(`Documentation artifact is missing ${expectedEntry}`);
  }
}

const forbiddenValues = [
  "http://127.0.0.1:18080",
  "https://127.0.0.1:18080",
  "__DOCS_BASE_PATH__",
];
for (const forbiddenValue of forbiddenValues) {
  if (rootIndex.includes(forbiddenValue)) {
    throw new Error(
      `Documentation index contains forbidden value ${forbiddenValue}`,
    );
  }
}

process.stdout.write(
  `Verified documentation site at ${outputRoot} for base path ${basePath}\n`,
);
