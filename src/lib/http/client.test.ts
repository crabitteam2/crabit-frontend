import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import type { BffEnvironment } from "../../config/env";
import type {
  PersonaTokenConfiguration,
  PersonaTokenRegistry,
} from "../../config/persona-tokens";
import { resolveProfilePolicy, type BackendProfile } from "../../config/profile-policy";
import { PERSONAS } from "../persona/persona";
import type { Persona } from "../persona/persona";
import {
  BROWSER_API_BASE_URL,
  createBrowserApiClient,
} from "./browser";
import { createServerApiClient } from "./server";

describe("typed HTTP clients", () => {
  it("keeps browser requests on the same-origin BFF without credential inputs", async () => {
    let captured: Request | undefined;
    const client = createBrowserApiClient({
      Request: AbsoluteTestRequest,
      fetch: async (request) => {
        captured = request;
        return jsonResponse({ items: [], nextCursor: null });
      },
    });

    const result = await client.GET("/v1/me/card-balance-accounts");

    expect(result.data).toEqual({ items: [], nextCursor: null });
    expect(BROWSER_API_BASE_URL).toBe("/api/backend");
    expect(captured?.url).toBe(
      "http://frontend.test/api/backend/v1/me/card-balance-accounts",
    );
    expect(captured?.credentials).toBe("same-origin");
    expect(captured?.headers.get("authorization")).toBeNull();
  });

  it("uses validated BACKEND_URL directly and resolves only an explicit canonical persona", async () => {
    const tokens = tokenConfiguration("e2e");
    let captured: Request | undefined;
    const client = createServerApiClient(
      { persona: "friend" },
      {
        loadEnvironment: () => environment("e2e"),
        loadTokens: () => tokens,
        fetch: async (request) => {
          captured = request;
          return jsonResponse({ items: [], nextCursor: null });
        },
      },
    );

    await client.GET("/v1/me/card-balance-accounts");

    expect(captured?.url).toBe("https://backend.test/v1/me/card-balance-accounts");
    expect(captured?.headers.get("authorization")).toBe(
      `Bearer ${tokens.active?.friend}`,
    );
  });

  it.each([
    ["missing", {}],
    ["unknown", { persona: "stale-persona" as Persona }],
  ] as const)("does not default to owner for %s server context", async (_label, context) => {
    const tokens = tokenConfiguration("e2e");
    let captured: Request | undefined;
    const client = createServerApiClient(context, {
      loadEnvironment: () => environment("e2e"),
      loadTokens: () => tokens,
      fetch: async (request) => {
        captured = request;
        return jsonResponse({ items: [], nextCursor: null });
      },
    });

    await client.GET("/v1/me/card-balance-accounts");

    expect(captured?.headers.get("authorization")).toBeNull();
  });

  it("resolves request context through only the active cookie namespace", async () => {
    const tokens = tokenConfiguration("demo");
    let captured: Request | undefined;
    const client = createServerApiClient(
      {
        request: new Request("https://frontend.test", {
          headers: {
            Cookie: "crabit-e2e-persona=owner; crabit-demo-persona=staff",
          },
        }),
      },
      {
        loadEnvironment: () => environment("demo"),
        loadTokens: () => tokens,
        fetch: async (request) => {
          captured = request;
          return jsonResponse({ items: [], nextCursor: null });
        },
      },
    );

    await client.GET("/v1/me/card-balance-accounts");

    expect(captured?.headers.get("authorization")).toBe(
      `Bearer ${tokens.active?.staff}`,
    );
    expect(captured?.headers.get("cookie")).toBeNull();
  });
});

class AbsoluteTestRequest extends Request {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(
      typeof input === "string" && input.startsWith("/")
        ? `http://frontend.test${input}`
        : input,
      init,
    );
  }
}

function environment(backendProfile: BackendProfile): BffEnvironment {
  const profilePolicy = resolveProfilePolicy("local", backendProfile);
  return {
    appEnv: "local",
    backendProfile,
    backendUrl: new URL("https://backend.test"),
    profilePolicy,
  };
}

function tokenConfiguration(namespace: "e2e" | "demo"): PersonaTokenConfiguration {
  const registry = Object.fromEntries(PERSONAS.map((persona) => [
    persona,
    `${namespace}-${persona}-${randomUUID()}`,
  ])) as PersonaTokenRegistry;
  return {
    e2e: namespace === "e2e" ? registry : null,
    demo: namespace === "demo" ? registry : null,
    active: registry,
  };
}

function jsonResponse(value: unknown) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
