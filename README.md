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

The server exposes the backend through the same-origin `/api/backend/[...path]` Route Handler. See the canonical [Frontend BFF proxy Wiki source](docs/wiki/frontend-bff-proxy.md) for runtime configuration, forwarding rules, security boundaries, validation commands, and troubleshooting.

## Validation and production

```sh
npm run test
npm run lint
APP_ENV=local BACKEND_URL=http://127.0.0.1:18080 npm run build
APP_ENV=local BACKEND_URL=http://127.0.0.1:18080 npm run start
npm run smoke:bff
```
