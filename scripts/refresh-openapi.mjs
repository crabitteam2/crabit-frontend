import { createHash } from "node:crypto";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateOpenApi } from "./generate-openapi.mjs";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const options = readOptions(process.argv.slice(2));
const source = resolve(options.source);
const snapshotPath = resolve(projectRoot, "openapi/crabit-backend.yaml");
const provenancePath = resolve(projectRoot, "openapi/provenance.json");

const bytes = await readFile(source);
const digest = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
await copyFile(source, snapshotPath);
await writeFile(provenancePath, `${JSON.stringify({
  schema_version: 1,
  repository_id: "crabit-backend",
  repository_sha: options.repositorySha,
  source_path: options.sourcePath,
  source_sha256: digest,
}, null, 2)}\n`, "utf8");
await generateOpenApi();

console.log(`Refreshed OpenAPI snapshot from ${options.sourcePath} at ${options.repositorySha}`);

function readOptions(arguments_) {
  const values = new Map();
  for (let index = 0; index < arguments_.length; index += 2) {
    const name = arguments_[index];
    const value = arguments_[index + 1];
    if (!name?.startsWith("--") || value === undefined) {
      throw usageError();
    }
    values.set(name, value);
  }

  const source = values.get("--source");
  const repositorySha = values.get("--repository-sha");
  const sourcePath = values.get("--source-path") ?? "api/openapi.yaml";
  if (
    values.size < 2
    || values.size > 3
    || source === undefined
    || repositorySha === undefined
    || !/^[0-9a-f]{40}$/u.test(repositorySha)
    || sourcePath.length === 0
    || sourcePath.startsWith("/")
    || sourcePath.split("/").includes("..")
  ) {
    throw usageError();
  }

  for (const name of values.keys()) {
    if (!["--source", "--repository-sha", "--source-path"].includes(name)) {
      throw usageError();
    }
  }
  return { source, repositorySha, sourcePath };
}

function usageError() {
  return new Error(
    "Usage: npm run openapi:refresh -- --source <file> --repository-sha <sha> [--source-path api/openapi.yaml]",
  );
}
