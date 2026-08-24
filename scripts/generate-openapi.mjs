import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const snapshotPath = resolve(projectRoot, "openapi/crabit-backend.yaml");
const defaultOutputPath = resolve(
  projectRoot,
  "src/lib/http/generated/crabit-backend.ts",
);

export async function generateOpenApi(outputPath = defaultOutputPath) {
  const ast = await openapiTS(pathToFileURL(snapshotPath), {
    alphabetize: true,
  });
  const output = astToString(ast);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");
  return output;
}

if (isMainModule()) {
  const outputPath = readOutputArgument(process.argv.slice(2));
  await generateOpenApi(outputPath);
  console.log(`Generated ${relativeToProject(outputPath)}`);
}

function readOutputArgument(arguments_) {
  if (arguments_.length === 0) {
    return defaultOutputPath;
  }
  if (arguments_.length !== 2 || arguments_[0] !== "--output") {
    throw new Error("Usage: npm run openapi:generate -- [--output <path>]");
  }
  return resolve(projectRoot, arguments_[1]);
}

function relativeToProject(path) {
  return path.startsWith(`${projectRoot}/`) ? path.slice(projectRoot.length + 1) : path;
}

function isMainModule() {
  return process.argv[1] !== undefined
    && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
}
