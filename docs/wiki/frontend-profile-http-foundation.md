# Frontend profile, persona, and typed HTTP foundation

This page is the durable operations source for the frontend deployment profile policy, server-only persona credentials, persona cookies, BFF authorization boundary, pinned backend OpenAPI snapshot, and typed HTTP clients. It documents repository behavior; it does not claim that hosting secrets, backend Demo support, or a deployment is already available.

## Closed deployment matrix

`APP_ENV` describes where the frontend runs. `BACKEND_PROFILE` separately describes the backend capability set selected by `BACKEND_URL`. Missing, blank, unknown, or incompatible values fail closed.

| `APP_ENV` | Allowed `BACKEND_PROFILE` values | Notes |
| --- | --- | --- |
| `local` | `e2e`, `demo`, `prod` | Developer-selected backend |
| `e2e` | `e2e` | Automated persona and `/e2e/**` access |
| `staging` | `e2e` | HTTPS backend required |
| `prod` | `demo` | Stable Demo profile; HTTPS backend required |

`BACKEND_PROFILE=e2e` enables the E2E token namespace, `crabit-e2e-persona`, `/api/e2e/persona`, and `/e2e/**` upstream paths. `BACKEND_PROFILE=demo` enables only the Demo namespace, `crabit-demo-persona`, and `/api/demo/persona`. `BACKEND_PROFILE=prod` enables no synthetic credential and rejects any configured E2E or Demo token variable.

## Server-only persona credentials

The canonical persona keys are `owner`, `friend`, `nonfriend`, `blocked`, `other-academy`, and `staff`.

| Persona | E2E variable | Demo variable |
| --- | --- | --- |
| `owner` | `E2E_OWNER_TOKEN` | `CRABIT_DEMO_TOKEN_OWNER` |
| `friend` | `E2E_FRIEND_TOKEN` | `CRABIT_DEMO_TOKEN_FRIEND` |
| `nonfriend` | `E2E_NONFRIEND_TOKEN` | `CRABIT_DEMO_TOKEN_NONFRIEND` |
| `blocked` | `E2E_BLOCKED_TOKEN` | `CRABIT_DEMO_TOKEN_BLOCKED` |
| `other-academy` | `E2E_OTHER_ACADEMY_TOKEN` | `CRABIT_DEMO_TOKEN_OTHER_ACADEMY` |
| `staff` | `E2E_STAFF_TOKEN` | `CRABIT_DEMO_TOKEN_STAFF` |

The active namespace must contain all six values. Empty, whitespace-bearing, control-character-bearing, partial, or duplicate values are rejected. If any inactive namespace variable is configured, that namespace must also be complete and valid. A value may not be reused across namespaces. Errors never contain a token value.

Token values belong only in the server runtime secret store. Do not commit them, put them in `.env` files, prefix them with `NEXT_PUBLIC_`, send them to browser code, log them, or write them into cookies. Rotate one namespace as an atomic six-value set, restart the frontend server, verify its health, then revoke the old backend credentials. E2E and Demo rotations are independent.

Stable Demo remains externally dependent on a separately delivered backend Demo profile and matching credential registry. This frontend change alone does not make Demo authentication operational.

## Persona Route Handlers and cookies

`POST /api/e2e/persona` and `POST /api/demo/persona` accept exactly one JSON field, for example `{ "persona": "friend" }`, only when their backend profile is active. Success is bodyless `204`. `DELETE` idempotently clears that route's cookie. Unsupported methods return `405` with `Allow: POST, DELETE` only when the route is active; an inactive route returns `404` first.

Cookies store only the canonical persona key. Both namespaces use `HttpOnly`, `SameSite=Lax`, and `Path=/`; staging and prod always add `Secure`, as do HTTPS local/E2E requests. No route reads, sets, clears, or enumerates the other namespace. Invalid input never defaults to `owner`.

All route failures have exactly `code` and `message`, set `Cache-Control: no-store`, and never disclose tokens, parser details, or configuration values:

| Status | Code | Meaning |
| --- | --- | --- |
| `400` | `PERSONA_INVALID` | Invalid media type, JSON, object shape, or persona |
| `404` | `PERSONA_UNAVAILABLE` | Route namespace is inactive |
| `405` | `PERSONA_METHOD_NOT_ALLOWED` | Method is unsupported on an active route |
| `500` | `PERSONA_CONFIGURATION_ERROR` | Active persona registry is invalid |

## BFF credential and `/e2e` boundary

Browser credentials are stripped by the existing request allowlist. Only a valid canonical key from the active profile cookie can select a token, and the server then injects exactly one Bearer header. Missing, malformed, duplicate, stale, unknown, and inactive cookies inject no credential. `BACKEND_PROFILE=prod` never injects one.

The BFF validates the target before examining the E2E boundary. If the first validated decoded segment is exactly `e2e` and the backend profile is not E2E, it returns `404 BFF_NOT_FOUND` before reading the body, starting a timeout, or calling upstream.

## Pinned OpenAPI and generated types

`openapi/crabit-backend.yaml` is an exact byte snapshot of `crabit-backend/api/openapi.yaml`. `openapi/provenance.json` records the backend repository SHA, source path, and SHA-256 digest. Normal install, test, build, and drift verification use only these committed frontend files and do not require a sibling backend checkout.

Generate and check types:

```sh
npm run openapi:generate
npm run openapi:check
```

`openapi:check` verifies snapshot provenance, regenerates to a temporary location, and fails if `src/lib/http/generated/crabit-backend.ts` differs byte-for-byte.

The package manifest contains a package-scoped npm override that binds `openapi-typescript` to the repository's existing TypeScript version. This keeps plain `npm ci` reproducible while the generator's published peer range still names TypeScript 5. The override does not change other packages' peer resolution; remove it only after upgrading to a generator release whose peer metadata accepts the repository compiler and rerunning the full validation sequence.

Refresh is an explicit maintainer action after backend contract review:

```sh
npm run openapi:refresh -- \
  --source /absolute/path/to/crabit-backend/api/openapi.yaml \
  --repository-sha <40-character-backend-commit>
npm run openapi:check
```

Review the snapshot, provenance, and generated diff together. A backend OpenAPI byte change invalidates the old contract evidence; do not refresh as an incidental build step.

## Typed HTTP usage

Browser code obtains `createBrowserApiClient()`, whose base is fixed to same-origin `/api/backend` and which accepts no raw token, backend origin, or credential resolver. Server code obtains `createServerApiClient()`, which uses validated `BACKEND_URL` and can resolve only a canonical persona key or the active request cookie through the server-only registry.

Wish helpers in `src/lib/http/wishes.ts` hide raw paths and methods and expose generated request body and parameter types. They carry `Idempotency-Key`, `If-Match`, and `application/merge-patch+json` through the approved contract. Do not reconstruct operation paths, DTO casing, headers, or media types in UI code.

`normalizeErrorResponse()` recognizes only the exact generated nested backend envelope or documented flat BFF/persona envelope. Network and malformed responses map to fixed safe frontend errors. Arbitrary upstream fields, exception text, URLs, headers, cookies, tokens, and stack traces are discarded.

## Validation and troubleshooting

```sh
npm ci
npm run openapi:check
npm run test
npm run lint
APP_ENV=local BACKEND_PROFILE=prod BACKEND_URL=http://127.0.0.1:18080 npm run build
npm run smoke:bff
git diff --check
```

The production smoke creates synthetic credentials only in child-process memory, checks E2E injection and Demo denial against a controlled upstream, checks response/log/browser-asset non-disclosure, and then stops both servers. It does not verify a real Spring backend or a deployed secret store.

- `BFF_CONFIGURATION_ERROR` usually means the profile pair, URL, or configured token namespaces failed validation.
- `PERSONA_CONFIGURATION_ERROR` means the active route exists but its six-token namespace is incomplete or invalid.
- `PERSONA_UNAVAILABLE` means the route does not belong to the selected backend profile.
- `BFF_NOT_FOUND` for `/e2e/**` is expected outside `BACKEND_PROFILE=e2e`.
- `MALFORMED_RESPONSE` means an upstream error was not the exact trusted JSON contract; inspect server-side diagnostics by trace ID when one is safely available elsewhere.
