import { beforeEach, expect, it, vi } from "vitest";

const request = vi.hoisted(() => ({ profile: "demo", cookie: "" }));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ cookie: request.cookie }) }));
vi.mock("@/config/env", () => ({ readBffEnvironment: () => ({ backendProfile: request.profile }) }));

import { readPersonaDisplayName } from "./display-name-server";

beforeEach(() => { request.profile = "demo"; request.cookie = ""; });
it("follows the current request when representatives switch", async () => {
  for (const grade of [3, 4, 5, 6, 3]) {
    request.cookie = `crabit-demo-persona=grade-${grade}`;
    expect(await readPersonaDisplayName()).toBe(`${grade}학년 대표`);
  }
});
it("does not invent a nickname or use a demo identity outside demo", async () => {
  expect(await readPersonaDisplayName()).toBe("나");
  request.profile = "prod";
  request.cookie = "crabit-demo-persona=grade-4";
  expect(await readPersonaDisplayName()).toBe("나");
});
