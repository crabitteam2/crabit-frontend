import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { PERSONA_TOKEN_VARIABLES } from "../../../../config/persona-tokens";
import { PERSONAS } from "../../../../lib/persona/persona";
import { DELETE, GET, POST } from "./route";

describe("/api/e2e/persona", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(PERSONAS)(
    "sets only the canonical E2E persona key for %s",
    async (persona) => {
      const tokens = configure("local", "e2e", "e2e");
      const response = await POST(personaRequest("POST", { persona }));
      const text = await response.text();

      expect(response.status).toBe(204);
      expect(text).toBe("");
      expect(response.headers.get("content-type")).toBeNull();
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(response.headers.getSetCookie()[0]).toBe(
        `crabit-e2e-persona=${persona}; Path=/; HttpOnly; SameSite=Lax`,
      );
      for (const token of tokens) {
        expect(response.headers.get("set-cookie")).not.toContain(token);
        expect(text).not.toContain(token);
      }
    },
  );

  it.each([
    { contentType: undefined, body: JSON.stringify({ persona: "owner" }) },
    { contentType: "text/plain", body: JSON.stringify({ persona: "owner" }) },
    {
      contentType: "application/json; charset",
      body: JSON.stringify({ persona: "owner" }),
    },
    {
      contentType: "application/json; =utf-8",
      body: JSON.stringify({ persona: "owner" }),
    },
    {
      contentType: 'application/json; charset="unterminated',
      body: JSON.stringify({ persona: "owner" }),
    },
    { contentType: "application/json", body: "{" },
    { contentType: "application/json", body: "null" },
    { contentType: "application/json", body: "[]" },
    { contentType: "application/json", body: "{}" },
    {
      contentType: "application/json",
      body: JSON.stringify({ persona: "unknown" }),
    },
    {
      contentType: "application/json",
      body: JSON.stringify({ persona: "owner", extra: true }),
    },
  ])(
    "returns the stable invalid response for malformed input %#",
    async ({ contentType, body }) => {
      configure("local", "e2e", "e2e");
      const response = await POST(
        new Request("http://frontend.test/api/e2e/persona", {
          method: "POST",
          headers:
            contentType === undefined
              ? undefined
              : { "Content-Type": contentType },
          body,
        }),
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        code: "PERSONA_INVALID",
        message: "Persona selection is invalid",
      });
      expect(response.headers.get("set-cookie")).toBeNull();
    },
  );

  it.each([
    "application/json; charset=utf-8",
    'Application/JSON; charset="utf-8"; profile="https://example.test/a;b\\\"c"',
  ])(
    "accepts application/json with valid media type parameters: %s",
    async (contentType) => {
      configure("local", "e2e", "e2e");
      const response = await POST(
        new Request("http://frontend.test/api/e2e/persona", {
          method: "POST",
          headers: { "Content-Type": contentType },
          body: JSON.stringify({ persona: "owner" }),
        }),
      );

      expect(response.status).toBe(204);
      expect(response.headers.getSetCookie()[0]).toBe(
        "crabit-e2e-persona=owner; Path=/; HttpOnly; SameSite=Lax",
      );
    },
  );

  it("clears only the E2E cookie without reading a request body", async () => {
    configure("e2e", "e2e", "e2e");
    const response = await DELETE(
      new Request("https://frontend.test/api/e2e/persona", {
        method: "DELETE",
        body: unreadableStream(),
        duplex: "half",
      } as RequestInit & { duplex: "half" }),
    );

    expect(response.status).toBe(204);
    expect(response.headers.getSetCookie()[0]).toBe(
      "crabit-e2e-persona=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure",
    );
    expect(response.headers.get("set-cookie")).not.toContain(
      "crabit-demo-persona",
    );
  });

  it("returns 404 before registry and body access when the E2E route is inactive", async () => {
    configureBase("local", "demo");
    const request = personaRequest("POST", { persona: "owner" });
    const json = vi.spyOn(request, "json");

    const response = await POST(request);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      code: "PERSONA_UNAVAILABLE",
      message: "Persona route is unavailable",
    });
    expect(json).not.toHaveBeenCalled();
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("returns 405 before registry access when the route is available", async () => {
    configureBase("local", "e2e");
    const response = await GET(
      new Request("http://frontend.test/api/e2e/persona"),
    );

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST, DELETE");
    await expect(response.json()).resolves.toEqual({
      code: "PERSONA_METHOD_NOT_ALLOWED",
      message: "HTTP method is not allowed",
    });
  });

  it("returns a secret-free 500 without mutating cookies for active registry failure", async () => {
    configureBase("local", "e2e");
    const response = await POST(personaRequest("POST", { persona: "owner" }));
    const text = await response.text();

    expect(response.status).toBe(500);
    expect(JSON.parse(text)).toEqual({
      code: "PERSONA_CONFIGURATION_ERROR",
      message: "Persona configuration is invalid",
    });
    expect(text).not.toContain("E2E_OWNER_TOKEN");
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});

function configure(
  appEnv: "local" | "e2e" | "staging" | "prod",
  backendProfile: "e2e" | "demo" | "prod",
  namespace: "e2e" | "demo",
) {
  configureBase(appEnv, backendProfile);
  return PERSONAS.map((persona) => {
    const token = `${namespace}-${persona}-${randomUUID()}`;
    vi.stubEnv(PERSONA_TOKEN_VARIABLES[namespace][persona], token);
    return token;
  });
}

function configureBase(appEnv: string, backendProfile: string) {
  vi.stubEnv("APP_ENV", appEnv);
  vi.stubEnv("BACKEND_PROFILE", backendProfile);
  vi.stubEnv(
    "BACKEND_URL",
    appEnv === "staging" || appEnv === "prod"
      ? "https://backend.test"
      : "http://backend.test",
  );
}

function personaRequest(method: string, body: unknown) {
  return new Request("http://frontend.test/api/e2e/persona", {
    method,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
}

function unreadableStream() {
  return new ReadableStream({
    pull(controller) {
      controller.error(new Error("body must not be read"));
    },
  });
}
