import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateOpenApi } from "./generate-openapi.mjs";

const snapshotPath = fileURLToPath(new URL("../openapi/crabit-backend.yaml", import.meta.url));
const provenancePath = fileURLToPath(new URL("../openapi/provenance.json", import.meta.url));
const generatedPath = fileURLToPath(
  new URL("../src/lib/http/generated/crabit-backend.ts", import.meta.url),
);

const provenance = JSON.parse(await readFile(provenancePath, "utf8"));
validateProvenance(provenance);

const snapshot = await readFile(snapshotPath);
const snapshotDigest = `sha256:${createHash("sha256").update(snapshot).digest("hex")}`;
if (snapshotDigest !== provenance.source_sha256) {
  throw new Error("OpenAPI snapshot does not match its provenance digest");
}

const temporaryDirectory = await mkdtemp(join(tmpdir(), "crabit-openapi-check-"));
try {
  const temporaryOutput = join(temporaryDirectory, "crabit-backend.ts");
  await generateOpenApi(temporaryOutput);
  const [expected, actual] = await Promise.all([
    readFile(generatedPath),
    readFile(temporaryOutput),
  ]);
  if (!expected.equals(actual)) {
    throw new Error("Generated OpenAPI types are out of date; run npm run openapi:generate");
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

console.log("OpenAPI provenance and generated types are current");

function validateProvenance(value) {
  const expectedKeys = [
    "repository_id",
    "repository_sha",
    "schema_version",
    "source_path",
    "source_sha256",
  ];
  if (
    typeof value !== "object"
    || value === null
    || Array.isArray(value)
    || JSON.stringify(Object.keys(value).sort()) !== JSON.stringify(expectedKeys)
    || value.schema_version !== 1
    || value.repository_id !== "crabit-backend"
    || !/^[0-9a-f]{40}$/u.test(value.repository_sha)
    || value.source_path !== "api/openapi.yaml"
    || !/^sha256:[0-9a-f]{64}$/u.test(value.source_sha256)
  ) {
    throw new Error("OpenAPI provenance is invalid");
  }
}
