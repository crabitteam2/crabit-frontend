import { readFileSync, statSync } from "node:fs";
import { spawn } from "node:child_process";

// Private configuration is read only by this server process and never copied to the project.
const file = process.env.CRABIT_DEMO_PRIVATE_CONNECTION;
if (!file || (statSync(file).mode & 0o077) !== 0) throw new Error("A private 0600 connection file is required");
const connection = JSON.parse(readFileSync(file, "utf8"));
const origin = new URL(connection.origin);
if (origin.protocol !== "http:" || origin.hostname !== "127.0.0.1" || origin.pathname !== "/" || origin.username || origin.password || origin.search || origin.hash) throw new Error("A local preview origin is required");
const env = { ...process.env, APP_ENV: "local", BACKEND_PROFILE: "demo", BACKEND_URL: origin.origin };
for (const name of ["OWNER", "FRIEND", "NONFRIEND", "BLOCKED", "OTHER_ACADEMY", "STAFF", "GRADE_3", "GRADE_4", "GRADE_5", "GRADE_6"]) {
  if (typeof connection.tokens?.[name] !== "string" || !connection.tokens[name]) throw new Error("Private preview credentials are incomplete");
  env[`CRABIT_DEMO_TOKEN_${name}`] = connection.tokens[name];
}
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", process.env.PORT ?? "53029"], { env, stdio: "inherit" });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code) => { process.exitCode = code ?? 1; });
