# Frontend BFF proxy

The frontend exposes a same-origin Backend-for-Frontend (BFF) route at `/api/backend/[...path]`. Browser code calls that route instead of learning the backend origin. The Route Handler validates server runtime configuration, applies a narrow forwarding policy, and returns the backend status and body without interpreting application payloads.

This Markdown file is the canonical repository source for the BFF Wiki page. Its presence does not mean a GitHub Wiki page has been published or synchronized.

## Request flow

```text
Browser -> /api/backend/<path> -> Next.js Route Handler -> configured backend
```

`APP_ENV`, `BACKEND_PROFILE`, `BACKEND_URL`, persona tokens, constructed backend targets, and validation details stay on the server. Client Components must not import `src/config/env.ts`, `src/config/persona-tokens.ts`, or the server HTTP adapter.

## Runtime configuration

All three variables are required and case-sensitive. They are independent of `NODE_ENV`.

| Variable | Allowed values |
| --- | --- |
| `APP_ENV` | Exactly `local`, `e2e`, `staging`, or `prod` |
| `BACKEND_PROFILE` | Exactly `e2e`, `demo`, or `prod`; the pair must be allowed by the profile matrix |
| `BACKEND_URL` | An absolute backend origin with an optional port and only the root path |

`BACKEND_URL` must not contain credentials, whitespace, a query, a fragment, or a non-root path. `local` and `e2e` allow HTTP or HTTPS. `staging` and `prod` require HTTPS.

Safe examples:

```sh
APP_ENV=local BACKEND_PROFILE=prod BACKEND_URL=http://127.0.0.1:8080 npm run dev
APP_ENV=e2e BACKEND_PROFILE=e2e BACKEND_URL=http://127.0.0.1:18080 npm run start
APP_ENV=staging BACKEND_PROFILE=e2e BACKEND_URL=https://backend.staging.example npm run start
APP_ENV=prod BACKEND_PROFILE=demo BACKEND_URL=https://backend.example:8443 npm run start
```

Do not use values such as `http://user:password@backend.example`, `https://backend.example/api`, or `https://backend.example?tenant=crabit`.

## Forwarding contract

The route requires at least one path segment after `/api/backend/`.

| Method | Behavior |
| --- | --- |
| `GET` | Forwarded without a request body |
| `POST`, `PUT`, `PATCH`, `DELETE` | Forwarded with the incoming body bytes, including an empty body |
| `HEAD`, `OPTIONS` | Rejected with `405`; the backend is not contacted |

Each decoded path segment is validated and encoded independently. Empty segments, dot segments, decoded slashes, backslashes, and NUL characters are rejected. Query ordering, repeated keys, blank values, percent-encoding, and percent-hex case are preserved from the incoming request target.

The BFF does not parse JSON, merge-patch, text, or binary bodies and does not enforce application-specific media types.

### Request headers

Only these incoming values may be copied to the backend:

- `Accept`
- `Accept-Language`
- `Content-Type`
- `Idempotency-Key`
- `If-Match`

`Authorization`, `Cookie`, `Proxy-Authorization`, browser `Host`, framing fields, forwarding fields, and hop-by-hop fields are never copied. A field named by the incoming `Connection` header is also removed even when it appears in the allowlist. The HTTP transport may generate its own framing or connection headers; it never reuses the stripped browser value.

The BFF never forwards browser `Authorization`, `Cookie`, or `Proxy-Authorization`. For an active `e2e` or `demo` profile, it reads only that profile's canonical persona cookie and resolves the key through the corresponding server-only token namespace. A valid key injects exactly one server-selected `Authorization: Bearer ...` header. Missing, duplicate, malformed, unknown, stale, or inactive-namespace cookies inject nothing and never default to `owner`.

The first validated path segment `e2e` is forwarded only when `BACKEND_PROFILE=e2e`. Demo, production-backend, and other non-E2E profiles return `404 BFF_NOT_FOUND` before body reading or upstream access.

### Backend execution and response

Backend requests use a 10-second deadline, `redirect: manual`, and `cache: no-store`. Redirects are never followed.

The backend status and response bytes are preserved. Only `Content-Type`, `WWW-Authenticate`, and `Idempotency-Replayed` may be copied back, unless an upstream `Connection` header names one of them. `Set-Cookie`, `Location`, `Content-Length`, `Content-Encoding`, backend cache metadata, hop-by-hop fields, and all other backend headers are stripped. Every BFF response sets `Cache-Control: no-store`.

Statuses that prohibit response bodies are returned with a null body. Backend `4xx` and `5xx` responses are ordinary backend responses and are not rewritten.

## BFF-generated failures

Generated failures use `application/json`, `Cache-Control: no-store`, and exactly `code` plus `message`.

| Status | Code | Message | Typical cause |
| --- | --- | --- | --- |
| `400` | `BFF_INVALID_REQUEST` | `BFF request is invalid` | Unsafe path/target or unreadable request body |
| `405` | `BFF_METHOD_NOT_ALLOWED` | `HTTP method is not allowed` | Explicit `HEAD` or `OPTIONS` request |
| `500` | `BFF_CONFIGURATION_ERROR` | `BFF configuration is invalid` | Invalid profile pair, URL, or persona registry |
| `404` | `BFF_NOT_FOUND` | `BFF route is not found` | `/e2e/**` requested outside the E2E backend profile |
| `502` | `BFF_UPSTREAM_UNAVAILABLE` | `Backend service is unavailable` | Network failure or 10-second timeout |

Generated responses and logs must not contain environment values, backend or target URLs, credentials, parser errors, upstream exception text, or stack traces.

## Install, validate, and run

```sh
npm ci
npm run test
npm run lint
APP_ENV=local BACKEND_PROFILE=prod BACKEND_URL=http://127.0.0.1:18080 npm run build
APP_ENV=local BACKEND_PROFILE=prod BACKEND_URL=http://127.0.0.1:18080 npm run start
npm run smoke:bff
```

Run the smoke command after the production build. It starts a controlled local upstream and the built Next.js server, checks representative forwarding, stripping, redirect, rejection, and byte-preservation behavior, and stops both processes. It does not claim a real Spring backend success-path test.

## Troubleshooting and security rules

- A `500 BFF_CONFIGURATION_ERROR` means configuration was rejected. Check the exact `APP_ENV`/`BACKEND_PROFILE` pair, active token namespace completeness and uniqueness, URL scheme, root-only path, and absence of whitespace, credentials, query, or fragment. The response intentionally omits the rejected value.
- A `502 BFF_UPSTREAM_UNAVAILABLE` means the backend could not complete within the deadline. Check backend reachability and DNS from the Next.js server environment.
- A backend authentication response is expected when no valid active persona cookie exists; browser credentials are intentionally stripped and never replace the server-selected credential.
- A redirect reaches the browser as its original status and body without `Location`; the BFF will not follow it.
- Never rename token variables with a `NEXT_PUBLIC_` prefix, expose tokens or the configured origin in a browser payload, add credential forwarding, or loosen the header/path policy without a new contract review.
