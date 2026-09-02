# Frontend profile, persona, and typed HTTP foundation

This page is the durable operations source for the frontend deployment profile policy, server-only persona credentials, persona cookies, BFF authorization boundary, pinned backend OpenAPI snapshot, and typed HTTP clients. It documents repository behavior and the backend support present at the pinned source revision. It does not claim that hosting secrets or a deployment is already available.

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

The backend source pinned below contains separate E2E and Demo authentication filters, token registries, fixture initialization, and profile resources. The Demo profile includes six server-only persona-token settings, Demo fixture lifecycle support, and `DemoHttpCardBalanceProvider`; the E2E profile includes deterministic fixtures, a fixed clock, scripted balance behavior, and `/e2e` control routes. The profiles are mutually exclusive: Demo does not load the E2E routes or deterministic balance scripts.

Repository deployment design intends staging backend images built from `develop` to run with the E2E profile and Stable Demo backend images built from protected `main` to run with the Demo profile. This implementation did not verify a deployed image digest, running service, HTTPS endpoint, secret injection, database health, or frontend-to-backend runtime success. Matching server secrets and a verified deployment are still required before persona authentication is operational.

## Google Cloud backend-origin cutover

Moving the backend hosts to Google Cloud changes only the environment-scoped `BACKEND_URL` origins. It does not change the frontend profile matrix, persona namespaces, BFF routes, cookies, generated OpenAPI snapshot, or application API behavior. Staging must remain `APP_ENV=staging` with `BACKEND_PROFILE=e2e`; Stable Demo must remain `APP_ENV=prod` with `BACKEND_PROFILE=demo`. Each environment uses its own verified HTTPS root origin derived from its reserved Google Cloud public IPv4 address. Do not reuse one environment's origin or persona namespace in the other environment, and do not put the origin or persona credentials in browser-visible configuration.

The Google Cloud databases are greenfield installations. Staging is initialized only from the backend's deterministic E2E profile, and Stable Demo is initialized only from the repository-defined Demo migrations, fixture, and serialized reset operation. Historical Vultr database contents are unavailable and are not migrated. Vultr is not a cutover dependency or rollback target.

Update the Vercel Staging `BACKEND_URL` only after the matching Google Cloud runtime has independently proved the selected immutable Docker Hub digest, the exact aggregate `UP` HTTPS readiness response, all six E2E personas, restart persistence, and server-only credential non-disclosure. Update the Vercel Stable Demo `BACKEND_URL` only after the separate Demo runtime has proved the same image and readiness properties, all six Demo personas, restart persistence, the serialized reset result, and server-only non-disclosure. For each environment, redeploy after changing the variable and read back the environment-scoped value, deployed revision or alias, BFF routing to the expected Google Cloud origin, profile-specific persona behavior, and the absence of credentials from browser assets, responses, and logs.

Repository checks do not prove that Google Cloud resources exist or that Vercel is using a new origin. Those delivery claims require provider read-back and live end-to-end verification. If a post-cutover rollback is required, keep Vercel pointed at a single writable Google Cloud database and use only the backend runbook's retained immutable image digest or verified Persistent Disk snapshot recovery path; never point the frontend back to Vultr.

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

The current snapshot pins backend revision `c4e449e2e9a1813499ef583d70985030d6f7ace2` and source digest `sha256:15cf263f6ee7b2c4afdb6db0bdb849c71c1bd49a8e7d1d6679d4a2a85e03bc9a`. It includes directional academy follows, independent following/follower lists, global blocks, and the canonical Wish photo contract.

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

Wish helpers in `src/lib/http/wishes.ts` hide raw paths and methods and expose generated request body and parameter types. `listWishes()`, `getWish()`, `createWish()`, `patchWish()`, and `deleteWish()` all return `ApiResult`; they carry repeated state filters, `Idempotency-Key`, `If-Match`, and `application/merge-patch+json` through the approved contract. The regenerated contract also records `415 UNSUPPORTED_MEDIA_TYPE` for create, complete, and abandon, `400 MALFORMED_REQUEST` for malformed Wish detail paths, and the ability to change visibility on an abandoned Wish through the existing patch shape.

`getRepresentativeWish()` returns the selected `Wish`, or successful `undefined` for the backend's bodyless `204`. `selectRepresentativeWish()` accepts only a generated `{ wishId }` body and returns the selected `Wish` directly. It does not expose an idempotency key, concurrency header, `WishMutationResult`, or event ID. Selecting the current representative is a successful no-op according to the backend contract; same-account `IN_PROGRESS` and `AMOUNT_REACHED` Wishes are eligible, while `COMPLETED` and `ABANDONED` Wishes return `INVALID_STATE_TRANSITION`.

`src/lib/http/follows.ts` provides generated-type-backed Student Relationships helpers:

- `searchAcademyStudents`: whole-academy nickname discovery;
- `listAcademyFollowing` and `listAcademyFollowers`: optional nickname filtering inside the selected relation list, preserving the backend's independent `isFollowing` and `isFollowedBy` flags and total `followingCount` and `followerCount`;
- bodyless `followAcademyStudent` (`PUT`) and `unfollowAcademyStudent` (`DELETE`), both returning success for duplicate valid current-state requests;
- list, create, and release global student blocks.

The old friend and friend-request helpers and endpoints have been removed without a compatibility layer. The two counts are totals for the selected academy, never derived from search results or loaded row counts. Cursors remain bound to actor, academy, direction, and normalized search; discard the cursor and start again when any context changes.

Relationship mutations on the same client and target student are queued in call order across academies, including block and unblock. Reuse one client per authenticated context, and retain this same-target sequencing when wiring future screens. Different clients or devices are ordered only by the server. Do not automatically retry a stale follow after an unfollow: a later processed follow can create a new relationship. A failed request releases the local queue; it is never automatically retried.

The existing student search and profile screens remain mock-backed. No new following/follower screen or real relationship API wiring is included. Mock profiles carry independent directional flags and explicit Wish visibility; a block terminates both flags, and unblock restores neither. `FOLLOWERS` requires viewer-to-owner following. The opposite student's block still denies all shared visibility; `ACADEMY` visibility can return after both blocks are absent. Profile-local state is keyed by student identity to avoid leaking another student's visibility on navigation. This mock state remains local to the mounted profile; backend authorization remains authoritative for future API wiring.

The existing share form sends `FOLLOWERS` for “팔로워 공개”; `FRIENDS` is no longer a contract value. Existing persona keys (`friend`, `nonfriend`) and secret variable names are unchanged backend fixture identifiers; they do not mean a mutual friendship. The fixture's `friend` persona follows the owner.

Search and list helpers preserve opaque cursors without decoding them. Bodyless action and delete helpers send no fabricated request body, idempotency key, or concurrency header, and bodyless `204` success maps to `ApiResult<undefined>`. Callers supply an already constructed `CrabitApiClient`; no helper accepts a raw method, path, origin, token, cookie, or `Authorization` value.

`getCardBalanceAccount()` preserves the generated `UNKNOWN` versus `KNOWN` union, including nullable unknown balances and the read-time `balanceAdjustmentInProgress` projection. Do not reconstruct operation paths, DTO casing, headers, or media types in UI code.

`ApiResult` returns either exact generated success data or a normalized `FrontendHttpError`. `unwrapResult()` returns success data unchanged and throws only `FrontendRequestError` with that normalized error as its programmatic payload. Raw response bodies, fetch exceptions, credentials, cookies, headers, and parser internals do not cross this boundary. React Query policy, hooks, cache keys, and UI states remain a separate feature concern.

`normalizeErrorResponse()` recognizes only the exact generated nested backend envelope or documented flat BFF/persona envelope. Its backend allowlist matches the pinned canonical `ErrorCode` values, including Student Relationships and Wish photo failures. Removed friend/request codes are rejected. The approved snapshot still contains unused `FOLLOWERSHIP_NOT_FOUND` and `ALREADY_FOLLOWERS` enum entries inherited from legacy error names. They do not describe the follow endpoints: duplicate valid follow/unfollow requests succeed with 204, and hidden targets use `STUDENT_NOT_FOUND`. Contract cleanup needs a separately reviewed backend snapshot. Unknown codes still map to `MALFORMED_RESPONSE`. Network and malformed responses map to fixed safe frontend errors. Arbitrary upstream fields, exception text, URLs, headers, cookies, tokens, and stack traces are discarded.

## Validation and troubleshooting

```sh
npm ci
npm run openapi:check
npm run test
npm run lint
APP_ENV=local BACKEND_PROFILE=prod BACKEND_URL=http://127.0.0.1:18080 npm run build
npm run smoke:bff
npm run build:docs
npm run verify:docs -- --base-path /crabit-frontend/
git diff --check
```

The production smoke creates synthetic credentials only in child-process memory, checks E2E injection and Demo denial against a controlled upstream, checks response/log/browser-asset non-disclosure, and then stops both servers. It does not verify a real Spring backend or a deployed secret store.

- `BFF_CONFIGURATION_ERROR` usually means the profile pair, URL, or configured token namespaces failed validation.
- `PERSONA_CONFIGURATION_ERROR` means the active route exists but its six-token namespace is incomplete or invalid.
- `PERSONA_UNAVAILABLE` means the route does not belong to the selected backend profile.
- `BFF_NOT_FOUND` for `/e2e/**` is expected outside `BACKEND_PROFILE=e2e`.
- `MALFORMED_RESPONSE` means an upstream error was not the exact trusted JSON contract; inspect server-side diagnostics by trace ID when one is safely available elsewhere.
