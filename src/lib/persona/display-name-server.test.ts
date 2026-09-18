import { beforeEach, expect, it, vi } from "vitest";

const request = vi.hoisted(() => ({ profile: "demo", cookie: "" }));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ cookie: request.cookie }) }));
vi.mock("@/config/env", () => ({ readBffEnvironment: () => ({ backendProfile: request.profile }) }));

import { MY_NAME } from "@/lib/mock/home";
import { readPersonaDisplayName } from "./display-name-server";

beforeEach(() => { request.profile = "demo"; request.cookie = ""; });
it("follows the current request when representatives switch", async () => {
  for (const grade of [3, 4, 5, 6, 3]) {
    request.cookie = `crabit-demo-persona=grade-${grade}`;
    expect(await readPersonaDisplayName()).toBe(`${grade}학년 대표`);
  }
});
it("falls back to the placeholder name and ignores a demo identity outside demo", async () => {
  expect(await readPersonaDisplayName()).toBe(MY_NAME);
  request.profile = "prod";
  request.cookie = "crabit-demo-persona=grade-4";
  expect(await readPersonaDisplayName()).toBe(MY_NAME);
});
