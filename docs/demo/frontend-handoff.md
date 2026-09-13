# Demo representative frontend

The controller-created worktree is based on frontend HEAD `29ba644f490b4c15429dd79dcff36fa8ab10559f`. Product edits remain uncommitted for the controller. The action-bound snapshot is revision 15; implementation does not mutate lifecycle state.

## Selection and credentials

`/demo` and the demo-only selector expose grade-3 through grade-6 aliases. Selected account ID, academy ID and observed balance come from the existing authenticated account API. Home uses the selected grade label instead of the fixed mock owner name. Existing wish, feed and recap routes use the same authenticated server client; no dataset values are hardcoded. Recap links select the supplied completed periods, week 2026-08-31 and month 2026-08. Normal NOT_ELIGIBLE responses retain the existing empty-state presentation.

The six existing persona credentials remain required for their namespace. Demo can optionally add **all four** `CRABIT_DEMO_TOKEN_GRADE_3` through `CRABIT_DEMO_TOKEN_GRADE_6`. Partial, blank, whitespace/control-bearing, duplicate and cross-namespace reused tokens are rejected. E2E still requires only six tokens and cannot select grades. Prod backend rejects synthetic credentials.

SSR, BFF and behavior hashes share one canonical cookie resolver. An absent active-namespace cookie retains Owner. Unknown, empty, malformed, duplicate and unconfigured grade selections never substitute Owner. BFF rejects invalid selection with 401 before upstream fetch; selection POST rejects unavailable grades. Tokens remain server-only and do not appear in selector props or public artifacts.

Successful POST sets an HttpOnly, SameSite=Lax persona cookie, rotates persona epoch and expires academy context. The selector then performs a full document replacement to `/demo`; BFCache restoration reloads the document. Prior behavior contexts are rejected. Failed selection keeps the current UI identity and displays a retry message. An invalid demo selection shows a recovery prompt.

## Local real-service verification

Build with `npm run build -- --webpack` when the host's Turbopack internal port binding fails. Start the local production preview by setting `CRABIT_DEMO_PRIVATE_CONNECTION` to the private 0600 connection JSON and running `node scripts/demo/preview.mjs`. This accepts a loopback backend only, reads origin/tokens without printing them, and injects credentials into the server process environment. It does not copy credentials into frontend files.

Run `DEMO_FRONTEND_ORIGIN=http://127.0.0.1:53029 E2E_API_BASE_URL=http://127.0.0.1:53028 npm run e2e -- tests/e2e/demo-simulation.spec.mjs`. The suite uses the real BFF/backend and no mocked API. Without an explicit frontend origin it skips and must not be reported passed. Output records actual representative accounts, balances and recap statuses. It covers four identities, SSR/BFF agreement, direct navigation, refresh, switching, stale collection rejection, duplicate-cookie rejection, desktop and 375px keyboard/overflow checks. It never invokes Owner refresh or provider lookup. Backend/DATA lifecycle, external apply, deploy and DB verification remain parent-owned.
