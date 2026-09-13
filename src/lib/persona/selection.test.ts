import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { resolveRequestPersona } from "./cookies";
import { handlePersonaRoute } from "./route";
import { readPersonaTokenConfiguration, PERSONA_TOKEN_VARIABLES, demoGradeVariable } from "../../config/persona-tokens";
import { DEMO_GRADE_PERSONAS, PERSONAS } from "./persona";
import { resolveProfilePolicy } from "../../config/profile-policy";
import { createServerApiClient } from "../http/server";
import { proxyBackendRequest } from "../bff/proxy";
import { currentContext } from "../behavior/context-server";
const values = Object.fromEntries(PERSONAS.map((p) => [PERSONA_TOKEN_VARIABLES.demo[p], `test-demo-${p}`]));
const grades = Object.fromEntries(DEMO_GRADE_PERSONAS.map((p) => [demoGradeVariable(p), `test-demo-${p}`]));
const environment = { appEnv: "local" as const, backendProfile: "demo" as const, backendUrl: new URL("http://backend.test"), profilePolicy: resolveProfilePolicy("local", "demo") };
const configuration = () => readPersonaTokenConfiguration("demo", { ...values, ...grades });
const dependencies = { loadEnvironment: () => environment, loadTokens: configuration };

describe("demo representative selection", () => {
  it("keeps grades optional and rejects partial, duplicate, malformed and prod grade configuration", () => {
    expect(readPersonaTokenConfiguration("demo", values).active?.["grade-3"]).toBeUndefined();
    for (const partial of [{ CRABIT_DEMO_TOKEN_GRADE_3: "x" }, { ...grades, CRABIT_DEMO_TOKEN_GRADE_3: values.CRABIT_DEMO_TOKEN_OWNER }, { ...grades, CRABIT_DEMO_TOKEN_GRADE_3: "bad token" }]) {
      expect(() => readPersonaTokenConfiguration("demo", { ...values, ...partial })).toThrow("configuration is invalid");
    }
    expect(() => readPersonaTokenConfiguration("prod", grades)).toThrow();
    const e2e = Object.fromEntries(PERSONAS.map((p) => [PERSONA_TOKEN_VARIABLES.e2e[p], `test-e2e-${p}`]));
    expect(Object.keys(readPersonaTokenConfiguration("e2e", e2e).active!)).toHaveLength(6);
    expect(() => readPersonaTokenConfiguration("e2e", { ...e2e, ...values, ...grades, CRABIT_DEMO_TOKEN_GRADE_3: e2e.E2E_OWNER_TOKEN })).toThrow();
  });
  it.each(DEMO_GRADE_PERSONAS)("propagates %s consistently through SSR, BFF and behavior context", async (persona) => {
    const headers = new Headers({ cookie: `crabit-demo-persona=${persona}` });
    expect(resolveRequestPersona(headers, "demo")).toBe(persona);
    expect(resolveRequestPersona(new Headers({cookie: `crabit-e2e-persona=${persona}`}), "e2e")).toBeNull();
    let serverCredential: string | null = null;
    await createServerApiClient({ request: { headers } }, { ...dependencies, fetch: async (request) => {
      serverCredential = request.headers.get("authorization");
      return Response.json({ items: [] });
    }}).GET("/v1/me/card-balance-accounts");
    const fetchImpl = vi.fn(async (_url, options) => {
      expect(options.headers.get("authorization")).toBe(serverCredential);
      return Response.json({ items: [] });
    });
    expect((await proxyBackendRequest(new Request("http://app/api/backend", { headers }), ["v1", "me", "card-balance-accounts"], { ...dependencies, fetchImpl })).status).toBe(200);
    expect(serverCredential).toBe(`Bearer test-demo-${persona}`);
    const academy = "11111111-1111-4111-8111-111111111111";
    const suffix = `; crabit-demo-academy-context=00000000-0000-0000-0000-000000000000.${academy}.22222222-2222-4222-8222-222222222222`;
    const context = currentContext(new Headers({cookie: `crabit-demo-persona=${persona}${suffix}`}), environment, academy);
    const ownerContext = currentContext(new Headers({cookie: `crabit-demo-persona=owner${suffix}`}), environment, academy);
    expect(context).toBeTruthy();
    expect(context).not.toBe(ownerContext);
    const response = await handlePersonaRoute(new Request("http://app/api/demo/persona", { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({persona}) }), "demo", dependencies);
    expect(response.status).toBe(204);
    expect(response.headers.getSetCookie()[0]).toContain(`${persona}; Path=/; HttpOnly`);
    expect(response.headers.getSetCookie()).toHaveLength(3);
    expect(response.headers.get("set-cookie")).not.toContain("test-demo");
  });
  it.each(["crabit-demo-persona=bad", "crabit-demo-persona=grade-3; crabit-demo-persona=grade-4", "crabit-demo-persona=", "crabit-demo-persona"])("fails closed before BFF fetch for %s", async (cookie) => {
    const headers = new Headers({ cookie });
    expect(resolveRequestPersona(headers, "demo")).toBeNull();
    const fetchImpl = vi.fn();
    expect((await proxyBackendRequest(new Request("http://app/api/backend", { headers }), ["v1", "me", "card-balance-accounts"], { ...dependencies, fetchImpl })).status).toBe(401);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
  it("retains absent-cookie Owner but never substitutes it for an unconfigured grade", async () => {
    expect(resolveRequestPersona(new Headers(), "demo")).toBe("owner");
    const noGrades = { ...dependencies, loadTokens: () => readPersonaTokenConfiguration("demo", values) };
    const fetchImpl = vi.fn();
    expect((await proxyBackendRequest(new Request("http://app/api/backend", { headers: {cookie: "crabit-demo-persona=grade-3"} }), ["v1", "me", "card-balance-accounts"], { ...noGrades, fetchImpl })).status).toBe(401);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect((await handlePersonaRoute(new Request("http://app/api/demo/persona", {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({persona:"grade-3"})}), "demo", noGrades)).status).toBe(400);
  });
});
