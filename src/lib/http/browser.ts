"use client";

import createClient from "openapi-fetch";
import type { paths } from "./generated/crabit-backend";

export const BROWSER_API_BASE_URL = "/api/backend";

export interface BrowserClientDependencies {
  readonly fetch?: (input: Request) => Promise<Response>;
  readonly Request?: typeof globalThis.Request;
}

export function createBrowserApiClient(
  dependencies: BrowserClientDependencies = {},
) {
  return createClient<paths>({
    baseUrl: BROWSER_API_BASE_URL,
    credentials: "same-origin",
    fetch: dependencies.fetch,
    Request: dependencies.Request,
  });
}

export type BrowserApiClient = ReturnType<typeof createBrowserApiClient>;
