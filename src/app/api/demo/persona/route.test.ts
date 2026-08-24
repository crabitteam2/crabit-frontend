import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { PERSONA_TOKEN_VARIABLES } from "../../../../config/persona-tokens";
import { PERSONAS } from "../../../../lib/persona/persona";
import { DELETE, POST } from "./route";

describe("/api/demo/persona", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(PERSONAS)(
    "sets only the Demo namespace cookie for %s",
    async (persona) => {
      const tokens = configureDemo("local");
      const response = await POST(
        new Request("http://frontend.test/api/demo/persona", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona }),
        }),
      );

      expect(response.status).toBe(204);
      expect(response.headers.get("set-cookie")).toBe(
        `crabit-demo-persona=${persona}; Path=/; HttpOnly; SameSite=Lax`,
      );
      expect(response.headers.get("set-cookie")).not.toContain(
        "crabit-e2e-persona",
      );
      for (const token of tokens) {
        expect(response.headers.get("set-cookie")).not.toContain(token);
      }
    },
  );

  it("uses Secure for a stable Demo cookie even when the request URL is HTTP", async () => {
    configureDemo("prod");
    const response = await POST(
      new Request("http://frontend.test/api/demo/persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: "owner" }),
      }),
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("set-cookie")).toContain("; Secure");
  });

  it("clears only the Demo namespace cookie", async () => {
    configureDemo("prod");
    const response = await DELETE(
      new Request("https://frontend.test/api/demo/persona", {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("set-cookie")).toBe(
      "crabit-demo-persona=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure",
    );
    expect(response.headers.get("set-cookie")).not.toContain(
      "crabit-e2e-persona",
    );
  });

  it("does not expose the Demo route or inspect Demo credentials in an E2E profile", async () => {
    vi.stubEnv("APP_ENV", "local");
    vi.stubEnv("BACKEND_PROFILE", "e2e");
    vi.stubEnv("BACKEND_URL", "http://backend.test");
    const response = await POST(
      new Request("http://frontend.test/api/demo/persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: "owner" }),
      }),
    );

    expect(response.status).toBe(404);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});

function configureDemo(appEnv: "local" | "prod") {
  vi.stubEnv("APP_ENV", appEnv);
  vi.stubEnv("BACKEND_PROFILE", "demo");
  vi.stubEnv(
    "BACKEND_URL",
    appEnv === "prod" ? "https://backend.test" : "http://backend.test",
  );
  return PERSONAS.map((persona) => {
    const token = `demo-${persona}-${randomUUID()}`;
    vi.stubEnv(PERSONA_TOKEN_VARIABLES.demo[persona], token);
    return token;
  });
}
