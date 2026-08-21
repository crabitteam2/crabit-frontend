# crabit-frontend

The Crabit frontend runs on Next.js 16 with the App Router and the standard Node.js runtime.

## Requirements

- Node.js 20.9.0 or newer
- npm

## Development

Install the locked dependencies and start the development server:

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend-for-Frontend proxy

The server exposes the backend through the same-origin `/api/backend/[...path]` Route Handler. Deployment and backend profiles are validated separately, and E2E or Demo persona credentials are selected only on the server. See the canonical [Frontend BFF proxy Wiki source](docs/wiki/frontend-bff-proxy.md) and [profile/persona/typed HTTP operations Wiki source](docs/wiki/frontend-profile-http-foundation.md).

The checked backend contract snapshot lives at `openapi/crabit-backend.yaml`. Regenerate and verify its typed client input with:

```sh
npm run openapi:generate
npm run openapi:check
```

Feature code uses the typed helpers in `src/lib/http/`. They return `ApiResult`
instead of exposing raw `openapi-fetch` responses; `unwrapResult()` is the
framework-neutral bridge for consumers that need a sanitized thrown error.

## Validation and production

```sh
npm run test
npm run lint
APP_ENV=local BACKEND_PROFILE=prod BACKEND_URL=http://127.0.0.1:18080 npm run build
APP_ENV=local BACKEND_PROFILE=prod BACKEND_URL=http://127.0.0.1:18080 npm run start
npm run openapi:check
npm run smoke:bff
```
