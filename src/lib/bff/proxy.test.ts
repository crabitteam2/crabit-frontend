import { once } from "node:events";
import { randomUUID } from "node:crypto";
import {
  createServer,
  type IncomingHttpHeaders,
  type Server,
} from "node:http";
import type { AddressInfo } from "node:net";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock("server-only", () => ({}));

import type { BffEnvironment } from "../../config/env";
import type {
  PersonaTokenConfiguration,
  PersonaTokenRegistry,
} from "../../config/persona-tokens";
import { resolveProfilePolicy, type BackendProfile } from "../../config/profile-policy";
import { PERSONAS } from "../persona/persona";
import {
  proxyBackendRequest,
  type ProxyDependencies,
} from "./proxy";

interface ReceivedRequest {
  method: string;
  url: string;
  headers: IncomingHttpHeaders;
  body: Uint8Array;
}

describe("proxyBackendRequest", () => {
  let upstream: Server;
  let upstreamOrigin: string;
  const received: ReceivedRequest[] = [];

  beforeAll(async () => {
    upstream = createServer(async (request, response) => {
      const chunks: Buffer[] = [];
      for await (const chunk of request) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const record: ReceivedRequest = {
        method: request.method ?? "",
        url: request.url ?? "",
        headers: request.headers,
        body: Buffer.concat(chunks),
      };
      received.push(record);

      const pathname = new URL(request.url ?? "/", "http://upstream.test")
        .pathname;

      if (pathname === "/v1/redirect") {
        response.writeHead(302, {
          "Cache-Control": "public, max-age=600",
          "Content-Type": "text/plain",
          Location: "https://other.example/secret",
          "Set-Cookie": "session=upstream; HttpOnly",
        });
        response.end("redirect-body");
        return;
      }

      if (pathname === "/v1/response-headers") {
        response.writeHead(200, {
          Connection: "Idempotency-Replayed",
          "Content-Type": "application/octet-stream",
          "Idempotency-Replayed": "true",
          Location: "https://other.example/secret",
          "Set-Cookie": "session=upstream; HttpOnly",
          "WWW-Authenticate": "Bearer realm=\"crabit\"",
          "X-Debug": "must-not-pass",
        });
        response.end(Buffer.from([0, 255, 1, 254]));
        return;
      }

      if (pathname === "/v1/status") {
        response.writeHead(422, { "Content-Type": "application/octet-stream" });
        response.end(Buffer.from([222, 173, 190, 239]));
        return;
      }

      if (pathname === "/v1/no-content") {
        response.writeHead(204, { "Content-Type": "text/plain" });
        response.end();
        return;
      }

      const body = record.body.byteLength > 0 ? record.body : Buffer.from("ok");
      response.writeHead(200, {
        "Content-Type": request.headers["content-type"] ?? "text/plain",
      });
      response.end(body);
    });

    upstream.listen(0, "127.0.0.1");
    await once(upstream, "listening");
    const address = upstream.address() as AddressInfo;
    upstreamOrigin = `http://127.0.0.1:${address.port}`;
    currentUpstreamOrigin = upstreamOrigin;
  });

  afterAll(async () => {
    upstream.closeAllConnections();
    await new Promise<void>((resolve, reject) => {
      upstream.close((error) => (error ? reject(error) : resolve()));
    });
  });

  beforeEach(() => {
    received.length = 0;
  });

  it.each([
    {
      method: "GET",
      contentType: undefined,
      body: undefined,
      expectedBody: [],
    },
    {
      method: "POST",
      contentType: "application/json",
      body: Buffer.from('{"name":"crabit"}'),
      expectedBody: Array.from(Buffer.from('{"name":"crabit"}')),
    },
    {
      method: "PUT",
      contentType: "application/merge-patch+json",
      body: Buffer.from('{"name":null}'),
      expectedBody: Array.from(Buffer.from('{"name":null}')),
    },
    {
      method: "PATCH",
      contentType: "application/octet-stream",
      body: Buffer.from([0, 255, 1, 254]),
      expectedBody: [0, 255, 1, 254],
    },
    {
      method: "DELETE",
      contentType: "text/plain",
      body: Buffer.alloc(0),
      expectedBody: [],
    },
  ])(
    "forwards $method with the contract-prescribed raw body behavior",
    async ({ method, contentType, body, expectedBody }) => {
      const headers = contentType ? { "Content-Type": contentType } : undefined;
      const request = frontendRequest(method, "/v1/echo", { headers, body });

      const response = await proxy(request, ["v1", "echo"]);

      expect(response.status).toBe(200);
      expect(received).toHaveLength(1);
      expect(received[0].method).toBe(method);
      expect(Array.from(received[0].body)).toEqual(expectedBody);
      if (contentType) {
        expect(received[0].headers["content-type"]).toBe(contentType);
      }
    },
  );

  it("preserves text request bytes without parsing", async () => {
    const body = Buffer.from("Crabit 한글 payload", "utf8");

    const response = await proxy(
      frontendRequest("POST", "/v1/echo", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body,
      }),
      ["v1", "echo"],
    );

    expect(response.status).toBe(200);
    expect(Array.from(received[0].body)).toEqual(Array.from(body));
  });

  it("re-encodes decoded path segments and preserves the raw ordered query", async () => {
    const query = "?state=OPEN&state=CLOSED&cursor=a%2fb&empty=";
    const request = frontendRequest("GET", `/ignored${query}`);

    const response = await proxy(request, ["space here", "literal%2F"]);

    expect(response.status).toBe(200);
    expect(received[0].url).toBe(
      "/space%20here/literal%252F?state=OPEN&state=CLOSED&cursor=a%2fb&empty=",
    );
  });

  it.each([
    { path: [] },
    { path: [""] },
    { path: ["."] },
    { path: [".."] },
    { path: ["nested/segment"] },
    { path: ["back\\slash"] },
    { path: ["nul\0byte"] },
    { path: ["\uD800"] },
  ])("rejects an unsafe target without contacting upstream: $path", async ({ path }) => {
    const fetchImpl = vi.fn<typeof fetch>();

    const response = await proxy(
      frontendRequest("GET", "/v1/ignored"),
      path,
      { fetchImpl },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      code: "BFF_INVALID_REQUEST",
      message: "BFF request is invalid",
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("maps an unreadable request body to the stable invalid-request response", async () => {
    const request = frontendRequest("POST", "/v1/echo", { body: "payload" });
    await request.arrayBuffer();
    const fetchImpl = vi.fn<typeof fetch>();

    const response = await proxy(request, ["v1", "echo"], { fetchImpl });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      code: "BFF_INVALID_REQUEST",
      message: "BFF request is invalid",
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("copies only approved request headers and strips credentials and Connection nominees", async () => {
    const request = frontendRequest("POST", "/v1/echo", {
      body: "payload",
      headers: {
        Accept: "application/json",
        "Accept-Language": "ko-KR",
        Authorization: "Bearer browser-secret",
        Connection: "Idempotency-Key, Accept-Language",
        "Content-Length": "999",
        "Content-Type": "text/plain",
        Cookie: "session=browser-secret",
        Forwarded: "for=browser.invalid",
        Host: "browser.invalid",
        "Idempotency-Key": "idem-123",
        "If-Match": "7",
        "Proxy-Authorization": "Basic browser-secret",
        "X-Debug": "must-not-pass",
        "X-Forwarded-For": "203.0.113.10",
      },
    });

    const response = await proxy(request, ["v1", "echo"]);

    expect(response.status).toBe(200);
    const headers = received[0].headers;
    expect(headers.accept).toBe("application/json");
    expect(headers["content-type"]).toBe("text/plain");
    expect(headers["if-match"]).toBe("7");
    expect(headers.authorization).toBeUndefined();
    expect(headers.cookie).toBeUndefined();
    expect(headers["proxy-authorization"]).toBeUndefined();
    expect(headers.forwarded).toBeUndefined();
    expect(headers["x-forwarded-for"]).toBeUndefined();
    expect(headers["idempotency-key"]).toBeUndefined();
    expect(headers["accept-language"]).not.toBe("ko-KR");
    expect(headers["x-debug"]).toBeUndefined();
    expect(headers.host).not.toBe("browser.invalid");
    expect(headers["content-length"]).not.toBe("999");
    expect(headers.connection).not.toContain("Idempotency-Key");
  });

  it.each(PERSONAS)(
    "replaces browser credentials with only the server-resolved %s credential",
    async (persona) => {
      const tokens = tokenConfiguration("e2e");
      const token = tokens.active![persona];
      const request = frontendRequest("GET", "/v1/echo", {
        headers: {
          Authorization: "Bearer browser-value",
          Cookie: `unrelated=browser-value; crabit-e2e-persona=${persona}`,
          "Proxy-Authorization": "Basic browser-value",
        },
      });

      const response = await proxy(request, ["v1", "echo"], {
        loadEnvironment: () => environment("e2e"),
        loadTokens: () => tokens,
      });

      expect(response.status).toBe(200);
      expect(received).toHaveLength(1);
      expect(received[0].headers.authorization).toBe(`Bearer ${token}`);
      expect(received[0].headers.cookie).toBeUndefined();
      expect(received[0].headers["proxy-authorization"]).toBeUndefined();
      expect(await response.text()).not.toContain(token);
    },
  );

  it.each([
    ["missing", undefined],
    ["unknown", "crabit-e2e-persona=unknown"],
    ["stale namespace", "crabit-demo-persona=owner"],
    ["duplicate", "crabit-e2e-persona=owner; crabit-e2e-persona=friend"],
    ["malformed encoding", "crabit-e2e-persona=%ZZ"],
    ["noncanonical encoding", "crabit-e2e-persona=%66riend"],
    ["whitespace-bearing", "crabit-e2e-persona= friend"],
  ])("does not default to owner for a %s persona cookie", async (_label, cookie) => {
    const tokens = tokenConfiguration("e2e");
    const request = frontendRequest("GET", "/v1/echo", {
      headers: cookie === undefined ? undefined : { Cookie: cookie },
    });

    const response = await proxy(request, ["v1", "echo"], {
      loadEnvironment: () => environment("e2e"),
      loadTokens: () => tokens,
    });

    expect(response.status).toBe(200);
    expect(received[0].headers.authorization).toBeUndefined();
  });

  it("forwards a validated /e2e target only for the E2E backend profile", async () => {
    const response = await proxy(
      frontendRequest("GET", "/e2e/scenario"),
      ["e2e", "scenario"],
      {
        loadEnvironment: () => environment("e2e"),
        loadTokens: () => tokenConfiguration("e2e"),
      },
    );

    expect(response.status).toBe(200);
    expect(received[0].url).toBe("/e2e/scenario");
  });

  it.each(["demo", "prod"] as const)(
    "denies /e2e for the %s backend profile before reading the body or fetching",
    async (backendProfile) => {
      const fetchImpl = vi.fn<typeof fetch>();
      const request = frontendRequest("POST", "/e2e/scenario", { body: "secret body" });
      const bodyRead = vi.spyOn(request, "arrayBuffer");
      const response = await proxyBackendRequest(request, ["e2e", "scenario"], {
        fetchImpl,
        loadEnvironment: () => environment(backendProfile),
        loadTokens: () => backendProfile === "demo"
          ? tokenConfiguration("demo")
          : emptyTokenConfiguration(),
      });

      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toEqual({
        code: "BFF_NOT_FOUND",
        message: "BFF route is not found",
      });
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(bodyRead).not.toHaveBeenCalled();
      expect(fetchImpl).not.toHaveBeenCalled();
    },
  );

  it("preserves upstream status and bytes while applying the response allowlist", async () => {
    const response = await proxy(
      frontendRequest("GET", "/v1/status"),
      ["v1", "status"],
    );

    expect(response.status).toBe(422);
    expect(Array.from(new Uint8Array(await response.arrayBuffer()))).toEqual([
      222,
      173,
      190,
      239,
    ]);
    expect(response.headers.get("content-type")).toBe("application/octet-stream");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("copies only approved upstream headers and honors Connection nominees", async () => {
    const response = await proxy(
      frontendRequest("GET", "/v1/response-headers"),
      ["v1", "response-headers"],
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/octet-stream");
    expect(response.headers.get("www-authenticate")).toBe(
      'Bearer realm="crabit"',
    );
    expect(response.headers.get("idempotency-replayed")).toBeNull();
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-debug")).toBeNull();
    expect(response.headers.get("connection")).toBeNull();
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("does not follow redirects or expose redirect and cookie headers", async () => {
    const response = await proxy(
      frontendRequest("GET", "/v1/redirect"),
      ["v1", "redirect"],
    );

    expect(received).toHaveLength(1);
    expect(response.status).toBe(302);
    await expect(response.text()).resolves.toBe("redirect-body");
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("uses a null downstream body for an upstream status that forbids bodies", async () => {
    const response = await proxy(
      frontendRequest("GET", "/v1/no-content"),
      ["v1", "no-content"],
    );

    expect(response.status).toBe(204);
    expect(response.body).toBeNull();
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it.each(["HEAD", "OPTIONS"])(
    "returns 405 for %s without loading configuration or contacting upstream",
    async (method) => {
      const loadEnvironment = vi.fn<() => BffEnvironment>();
      const fetchImpl = vi.fn<typeof fetch>();

      const response = await proxyBackendRequest(
        frontendRequest(method, "/v1/echo"),
        ["v1", "echo"],
        { loadEnvironment, fetchImpl },
      );

      expect(response.status).toBe(405);
      expect(response.headers.get("allow")).toBe(
        "GET, POST, PUT, PATCH, DELETE",
      );
      expect(response.headers.get("cache-control")).toBe("no-store");
      await expect(response.json()).resolves.toEqual({
        code: "BFF_METHOD_NOT_ALLOWED",
        message: "HTTP method is not allowed",
      });
      expect(loadEnvironment).not.toHaveBeenCalled();
      expect(fetchImpl).not.toHaveBeenCalled();
    },
  );

  it("maps invalid configuration to a secret-free 500 without contacting upstream", async () => {
    const secret = "http://secret-backend.invalid";
    const fetchImpl = vi.fn<typeof fetch>();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await proxyBackendRequest(
      frontendRequest("GET", "/v1/echo"),
      ["v1", "echo"],
      {
        fetchImpl,
        loadEnvironment: () => {
          throw new Error(`BACKEND_URL=${secret}`);
        },
      },
    );
    const text = await response.text();

    expect(response.status).toBe(500);
    expect(JSON.parse(text)).toEqual({
      code: "BFF_CONFIGURATION_ERROR",
      message: "BFF configuration is invalid",
    });
    expect(text).not.toContain("APP_ENV");
    expect(text).not.toContain("BACKEND_URL");
    expect(text).not.toContain(secret);
    expect(consoleError).not.toHaveBeenCalled();
    expect(fetchImpl).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("maps credential registry failure to the same secret-free configuration boundary", async () => {
    const secret = `credential-${randomUUID()}`;
    const fetchImpl = vi.fn<typeof fetch>();
    const response = await proxyBackendRequest(
      frontendRequest("GET", "/v1/echo"),
      ["v1", "echo"],
      {
        fetchImpl,
        loadEnvironment: () => environment("e2e"),
        loadTokens: () => {
          throw new Error(secret);
        },
      },
    );
    const text = await response.text();

    expect(response.status).toBe(500);
    expect(JSON.parse(text)).toEqual({
      code: "BFF_CONFIGURATION_ERROR",
      message: "BFF configuration is invalid",
    });
    expect(text).not.toContain(secret);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("maps a network failure to the stable secret-free unavailable response", async () => {
    const secret = "http://secret-upstream.invalid";
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new Error(`connect ECONNREFUSED ${secret}`);
    });

    const response = await proxy(
      frontendRequest("GET", "/v1/echo"),
      ["v1", "echo"],
      { fetchImpl },
    );
    const text = await response.text();

    expect(response.status).toBe(502);
    expect(JSON.parse(text)).toEqual({
      code: "BFF_UPSTREAM_UNAVAILABLE",
      message: "Backend service is unavailable",
    });
    expect(text).not.toContain(secret);
  });

  it("aborts the upstream deadline and returns the stable unavailable response", async () => {
    const captured: { signal?: AbortSignal } = {};
    const fetchImpl = vi.fn(async (
      _input: RequestInfo | URL,
      init?: RequestInit,
    ) => {
      captured.signal = init?.signal ?? undefined;
      return await new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener(
          "abort",
          () => reject(new DOMException("secret timeout detail", "AbortError")),
          { once: true },
        );
      });
    });

    const response = await proxy(
      frontendRequest("GET", "/v1/echo"),
      ["v1", "echo"],
      { fetchImpl: fetchImpl as typeof fetch, timeoutMilliseconds: 10 },
    );

    expect(response.status).toBe(502);
    expect(captured.signal?.aborted).toBe(true);
    await expect(response.json()).resolves.toEqual({
      code: "BFF_UPSTREAM_UNAVAILABLE",
      message: "Backend service is unavailable",
    });
  });

  function proxy(
    request: Request,
    path: readonly string[],
    overrides: Partial<ProxyDependencies> = {},
  ) {
    return proxyBackendRequest(request, path, {
      fetchImpl: globalThis.fetch,
      loadEnvironment: () => environment("prod"),
      loadTokens: () => emptyTokenConfiguration(),
      timeoutMilliseconds: 1_000,
      ...overrides,
    });
  }
});

function frontendRequest(
  method: string,
  path: string,
  options: {
    body?: BodyInit;
    headers?: HeadersInit;
  } = {},
) {
  return new Request(`http://frontend.test/api/backend${path}`, {
    method,
    headers: options.headers,
    ...(options.body === undefined ? {} : { body: options.body }),
  });
}

function environment(backendProfile: BackendProfile): BffEnvironment {
  const profilePolicy = resolveProfilePolicy("local", backendProfile);
  return {
    appEnv: "local",
    backendProfile,
    backendUrl: new URL(upstreamOriginForTests()),
    profilePolicy,
  };
}

let currentUpstreamOrigin = "http://127.0.0.1";

function upstreamOriginForTests() {
  return currentUpstreamOrigin;
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

function emptyTokenConfiguration(): PersonaTokenConfiguration {
  return { e2e: null, demo: null, active: null };
}
