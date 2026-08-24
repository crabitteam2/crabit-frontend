import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputRoot = path.join(repositoryRoot, "dist", "docs");
const storybookOutput = path.join(outputRoot, "storybook");
const apiOutput = path.join(outputRoot, "api");

function readBasePath(argv) {
  const index = argv.indexOf("--base-path");
  const value = index < 0 ? "/crabit-frontend/" : argv[index + 1];
  if (
    typeof value !== "string" ||
    !/^\/[A-Za-z0-9._/-]*\/$/.test(value) ||
    value.includes("//") ||
    value.includes("..")
  ) {
    throw new Error("--base-path must be a safe absolute path ending in /");
  }
  return value;
}

function run(command, args) {
  const executable = process.platform === "win32" ? `${command}.cmd` : command;
  const result = spawnSync(executable, args, {
    cwd: repositoryRoot,
    env: {
      ...process.env,
      STORYBOOK_DISABLE_TELEMETRY: "1",
    },
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} exited with ${result.status}`,
    );
  }
}

const basePath = readBasePath(process.argv.slice(2));

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

run("npm", [
  "exec",
  "--",
  "storybook",
  "build",
  "--output-dir",
  storybookOutput,
  "--quiet",
]);
run("npm", ["exec", "--", "typedoc", "--out", apiOutput]);

const templatePath = path.join(repositoryRoot, "docs", "site", "index.html");
const indexTemplate = await readFile(templatePath, "utf8");
const renderedIndex = indexTemplate.replaceAll("__DOCS_BASE_PATH__", basePath);
await writeFile(path.join(outputRoot, "index.html"), renderedIndex);

const noJekyllPath = path.join(outputRoot, ".nojekyll");
await writeFile(noJekyllPath, "");
