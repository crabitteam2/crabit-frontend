# 프론트엔드 HTTP 아키텍처

이 문서는 UI에서 시작한 요청이 typed HTTP 계층, Next.js BFF, Spring 백엔드의 인증과
컨트롤러를 지나 다시 UI 오류 경계로 돌아오는 구조를 설명합니다. 서로 다른 Git revision의
구현을 비교하므로, 아래 상태 표와 각 절의 상태 표기를 먼저 확인해야 합니다.

이 Markdown은
[Frontend-HTTP-Architecture Wiki 페이지](https://github.com/crabitteam2/crabit-frontend/wiki/Frontend-HTTP-Architecture)의
편집 가능한 저장소 원본입니다. Wiki는 독자용 미러이며, 이 파일이 있다고 해서 게시나 동기화가
끝난 것은 아닙니다.

## 기준과 현재 상태

| 근거 | 고정 revision 또는 상태 | 이 문서에서의 역할 |
| --- | --- | --- |
| Riido | 이 작업에 승인된 목표와 task revision | 제품 의도, 범위, 인수 조건, 결정의 유일한 규범적 원천 |
| 프론트엔드 `main` | [`a322b1e5`](https://github.com/crabitteam2/crabit-frontend/tree/a322b1e5b5aa2feb7086d6e92b190f330c39ac21) | 현재 병합된 프론트엔드 구현의 기준 |
| typed HTTP 기능 | [`4f5cdb97`](https://github.com/crabitteam2/crabit-frontend/tree/4f5cdb97a80171dac872e599f3d5d162ff3bfaa8) | `delivery_ready` 증거와 열린 Draft PR 5가 있는 미병합 구현 |
| 백엔드 `main` | [`6ec7539a`](https://github.com/crabitteam2/crabit-backend/tree/6ec7539a34cf1a9e7766a34b4a9b9e084569eaaf) | 목표 OpenAPI와 Spring 런타임 구현의 기준 |
| 이 저장소의 `docs/wiki` | 커밋된 Markdown | 편집 가능한 구현 문서의 기준 |
| GitHub Wiki | 게시 후 별도 read-back 필요 | 독자용 미러이며 별도 기준 원천이 아님 |

`delivery_ready`는 병합, 배포, 출시를 뜻하지 않습니다. Draft PR 5는 열려 있고 `develop`을
base로 하며 충돌 상태입니다. 따라서 이 문서에서 `4f5cdb97`의 코드를 설명할 때는 항상
**미병합 typed HTTP 구현**이라는 전제가 붙습니다.

### 현재 `main`에서 가능한 것

프론트엔드 `main`의 제품 페이지는 아직 placeholder이며 UI가 백엔드를 호출하지 않습니다.
반면 `/api/backend/[...path]` Route Handler와 같은 출처 BFF는 구현되어 있습니다. 이 revision에는
`openapi/`와 `src/lib/http/`가 없고, BFF가 브라우저 자격 증명을 전달하거나 서버 bearer token을
주입하지 않습니다.

BFF 자체의 현재 동작과 운영 방법은
[프론트엔드 BFF 프록시](frontend-bff-proxy.md)를 따릅니다. 아래의 generated type, operation helper,
profile, persona 설명을 현재 `main`의 기능으로 해석하면 안 됩니다.

## 책임 구조

```text
제품 UI / hook
  -> operation helper (Wish, Card Balance Account)
  -> browser client ------------------------------+
       same-origin /api/backend                   |
  -> Next.js Route Handler                        | 미병합 typed HTTP 경로
  -> BFF path/profile/persona policy              |
  -> BACKEND_URL의 Spring API <-------------------+
       bearer filter -> CurrentPrincipal
       -> controller -> domain service
  -> HTTP response / ErrorEnvelope
  -> BFF status/body preservation
  -> ApiResult<T> / FrontendHttpError
  -> UI 오류 경계

Server Component / Route Handler
  -> server client -> BACKEND_URL의 Spring API
```

| 계층 | 책임 | 책임이 아닌 것 |
| --- | --- | --- |
| UI 또는 hook | 사용자 의도를 operation helper 호출로 바꾸고 `ApiResult`를 화면 상태로 처리 | 경로 문자열, 인증 헤더, 오류 스키마를 재구성하는 일 |
| generated type와 helper | OpenAPI operation의 path/query/header/body/response type을 적용 | 백엔드 계약을 새로 정의하거나 런타임 응답을 신뢰하는 일 |
| browser client | base URL을 같은 출처 `/api/backend`로 고정하고 same-origin credential 정책 적용 | 백엔드 오리진이나 bearer token을 브라우저에 노출하는 일 |
| server client | 서버에서 검증된 `BACKEND_URL`로 직접 호출하고 필요한 경우 서버 token 주입 | 브라우저를 거쳐 BFF를 다시 호출하는 일 |
| BFF | 대상·profile·persona 검증, 제한된 헤더 전달, 시간 제한, 응답 경계 적용 | 도메인 payload 해석 또는 백엔드 오류 재작성 |
| Spring 인증 filter | 알려진 bearer token을 `CurrentPrincipal`로 해석 | 브라우저 cookie 또는 프론트엔드 persona 값을 직접 신뢰하는 일 |
| controller와 domain service | 인증 주체와 입력으로 API·도메인 규칙 실행 | 프론트엔드 표시 정책 결정 |
| 결과·오류 경계 | 성공 data와 검증된 오류만 `ApiResult`로 노출 | 원시 예외, URL, header, cookie, token, parser 오류, stack 노출 |

## 미병합 typed HTTP 계층

이 절은 전부 `4f5cdb97` 기준입니다.

- [`createBrowserApiClient`](https://github.com/crabitteam2/crabit-frontend/blob/4f5cdb97a80171dac872e599f3d5d162ff3bfaa8/src/lib/http/browser.ts)는
  `openapi-fetch`와 generated `paths`를 사용하고 base URL을 `/api/backend`로 고정합니다.
- [`createServerApiClient`](https://github.com/crabitteam2/crabit-frontend/blob/4f5cdb97a80171dac872e599f3d5d162ff3bfaa8/src/lib/http/server.ts)는
  server-only 모듈입니다. 검증된 `BACKEND_URL`을 직접 사용하며 명시적 persona 또는 요청의
  HttpOnly persona cookie에서 서버 token을 선택합니다.
- [`wishes.ts`](https://github.com/crabitteam2/crabit-frontend/blob/4f5cdb97a80171dac872e599f3d5d162ff3bfaa8/src/lib/http/wishes.ts)와
  [`card-balance-accounts.ts`](https://github.com/crabitteam2/crabit-frontend/blob/4f5cdb97a80171dac872e599f3d5d162ff3bfaa8/src/lib/http/card-balance-accounts.ts)는
  호출자가 자유 형식 URL을 조립하지 않도록 operation별 함수와 option type을 제공합니다.
- [`apiResult`](https://github.com/crabitteam2/crabit-frontend/blob/4f5cdb97a80171dac872e599f3d5d162ff3bfaa8/src/lib/http/result.ts)는
  성공을 `{ ok: true, data }`, 실패를 `{ ok: false, error }`로 반환합니다. 예외 기반 경계가 필요한
  호출자는 `unwrapResult`를 사용할 수 있습니다.

generated type은 컴파일 시점의 사용 오류를 줄이지만 런타임 응답을 검증하는 보안 경계는
아닙니다. 런타임 오류 payload는 별도의 엄격한 정규화기를 통과합니다.

## 브라우저 요청 흐름

아래 흐름은 미병합 `4f5cdb97`의 typed HTTP와 persona 정책, 현재 BFF 구조, 백엔드
`6ec7539a`를 연결한 것입니다.

1. UI 또는 hook이 Wish나 Card Balance Account helper를 선택합니다. helper가 generated
   operation type으로 path, query, header, body, 성공 response를 제한합니다.
2. browser client가 같은 출처 `/api/backend`로 요청합니다. 브라우저가 백엔드 오리진이나
   서버 token을 알 필요가 없습니다.
3. Next.js Route Handler가 요청을 BFF에 위임합니다. BFF는 method, path segment, query target,
   `APP_ENV`, `BACKEND_PROFILE`, `BACKEND_URL`을 검증합니다.
4. BFF는 브라우저의 `Authorization`과 `Cookie`를 전달 목록에서 제거합니다. 활성 profile이
   `e2e` 또는 `demo`일 때만 해당 namespace의 유효한 HttpOnly persona cookie를 읽고, 서버에만
   있는 registry에서 고른 bearer token 하나를 주입합니다.
5. BFF는 백엔드를 `cache: no-store`, `redirect: manual`, 10초 timeout으로 호출합니다.
6. Spring의 해당 profile bearer filter가 알려진 token을 `CurrentPrincipal`로 바꿉니다. 자격
   증명이 없거나 알 수 없으면 `401`, `/v1`에 허용되지 않은 역할이면 `403`을 반환합니다.
7. controller가 인증 주체와 typed input을 domain service에 전달합니다. 성공 또는 백엔드의
   중첩 `ErrorEnvelope`가 HTTP 응답이 됩니다.
8. BFF는 허용된 response header만 남기고 upstream status와 body bytes를 보존합니다. typed
   client는 성공 data 또는 정규화된 `FrontendHttpError`를 UI 경계에 돌려줍니다.

## 서버 직접 요청 흐름

Server Component나 서버 Route Handler는 미병합 `createServerApiClient`를 사용해 BFF를 거치지
않고 검증된 `BACKEND_URL`로 요청할 수 있습니다.

1. 호출자는 명시적 persona 또는 현재 요청 중 하나만 context로 제공합니다.
2. server client가 `APP_ENV`와 `BACKEND_PROFILE` 조합을 검증하고 활성 token registry를 읽습니다.
3. profile에 credential namespace가 있으면 명시적 persona 또는 해당 HttpOnly cookie를 token으로
   해석합니다. `prod` backend profile에는 persona namespace와 token 주입이 없습니다.
4. client가 `cache: no-store`와 선택된 `Authorization: Bearer ...`로 백엔드를 직접 호출합니다.
5. 이후 Spring 인증, controller, domain service, `ApiResult` 처리는 브라우저 흐름과 같습니다.

서버 직접 경로는 같은 출처 BFF의 path/header/timeout 경계를 사용하지 않습니다. 따라서
`BACKEND_URL` 검증과 server-only 모듈 경계가 백엔드 오리진·token 비공개성에 중요합니다.

## HTTP 전달 세부 사항

### 요청

- BFF가 전달하는 method는 `GET`, `POST`, `PUT`, `PATCH`, `DELETE`입니다. `HEAD`와 `OPTIONS`는
  `405`로 거부합니다.
- path segment는 디코딩 후 각각 검증하고 다시 인코딩합니다. query의 순서, 중복 key, 빈 값,
  percent encoding은 원래 요청 대상을 보존합니다.
- 요청 header allowlist는 `Accept`, `Accept-Language`, `Content-Type`, `Idempotency-Key`,
  `If-Match`입니다.
- `Authorization`, `Cookie`, `Proxy-Authorization`, `Host`, framing·forwarding·hop-by-hop header는
  브라우저 값 그대로 전달하지 않습니다. 미병합 profile/persona 정책만 검증된 서버 token을
  새로 주입할 수 있습니다.
- BFF는 JSON, `application/merge-patch+json`, text, binary body를 해석하지 않고 body bytes를
  전달합니다. operation helper가 해당 operation의 media type과 body type을 적용합니다.

### 응답

- upstream status와 body bytes를 보존하며 `204`, `205`, `304`는 body 없이 반환합니다.
- 허용된 response header는 `Content-Type`, `WWW-Authenticate`, `Idempotency-Replayed`입니다.
  upstream `Connection`이 지목한 header는 허용 목록에 있어도 제거합니다.
- `Set-Cookie`, `Location`, `Content-Length`, `Content-Encoding`, upstream cache metadata와
  hop-by-hop header는 노출하지 않습니다.
- 모든 BFF response에는 `Cache-Control: no-store`를 설정합니다. redirect는 따라가지 않습니다.

더 자세한 path 검증, 설정 값, smoke 절차는 [BFF 전용 가이드](frontend-bff-proxy.md)에만 유지합니다.

## 성공과 오류 경계

오류의 출처와 wire shape를 섞지 않아야 합니다.

| 출처 | wire shape 또는 frontend 결과 | 처리 |
| --- | --- | --- |
| frontend client·로컬 검증 | 요청 전 type 오류, 또는 `{ kind: "malformed", code: "MALFORMED_RESPONSE", ... }` | generated type으로 호출을 제한하고, 예상 schema가 아닌 응답은 안전한 malformed 오류로 축소 |
| BFF·persona route | `{ "code": "...", "message": "..." }` | 정확히 두 key와 알려진 code인 경우에만 `kind: "bff"`로 정규화 |
| transport | HTTP response 없음 | `{ kind: "network", code: "NETWORK_ERROR", message: "Backend request failed", retryable: true }` |
| backend 인증·도메인 | `{ "error": { "code", "message", "retryable", "traceId", "fieldErrors", "details" } }` | 정확한 key와 알려진 backend code·value type을 검증한 뒤 `kind: "backend"`로 정규화 |

BFF가 만든 대표 오류에는 잘못된 대상의 `BFF_INVALID_REQUEST`, 허용되지 않은 method의
`BFF_METHOD_NOT_ALLOWED`, 잘못된 설정의 `BFF_CONFIGURATION_ERROR`, timeout·network 실패의
`BFF_UPSTREAM_UNAVAILABLE`가 있습니다. 미병합 profile/persona 구현은 `BFF_NOT_FOUND`와
`PERSONA_INVALID`, `PERSONA_UNAVAILABLE`, `PERSONA_METHOD_NOT_ALLOWED`,
`PERSONA_CONFIGURATION_ERROR`도 같은 flat shape로 만듭니다.

정규화기는 JSON media type, 객체 key, code allowlist, 문자열·boolean·배열·객체 type을 엄격하게
확인합니다. 검증 실패는 원문을 UI에 내보내지 않고 `MALFORMED_RESPONSE`로 축소합니다. 원시 예외,
요청·백엔드 URL, header, cookie, token, parser 메시지, stack trace는 public 오류에 포함하지 않습니다.

## OpenAPI 소유권과 생성 흐름

목표 계약의 소유자는 백엔드 저장소의
[`api/openapi.yaml`](https://github.com/crabitteam2/crabit-backend/blob/6ec7539a34cf1a9e7766a34b4a9b9e084569eaaf/api/openapi.yaml)입니다.
`6ec7539a`에서 이 파일의 SHA-256은
`f8ceea3137a890e235e5e75a111fc14e33208ca117e363c4a9d13bf5d1ff2eef`입니다.

미병합 typed HTTP commit의 생성 흐름은 다음과 같습니다.

```text
crabit-backend/api/openapi.yaml @ 6ec7539a
  -> crabit-frontend/openapi/crabit-backend.yaml (byte-equal snapshot)
  -> openapi/provenance.json (repository, revision, path, digest 고정)
  -> deterministic generation
  -> src/lib/http/generated/crabit-backend.ts
  -> browser/server client와 operation helper의 type input
```

`npm run openapi:check`는 snapshot provenance와 generated output의 drift를 확인합니다. 프론트엔드
snapshot과 generated TypeScript는 고정된 소비자 산출물이지 백엔드 계약의 새로운 원천이 아닙니다.
OpenAPI, provenance, generated type은 함께 검토하고 갱신해야 합니다.

## 구체적인 operation 예

이 예시는 모두 미병합 `4f5cdb97`의 helper와 백엔드 `6ec7539a` 계약에 고정됩니다. 현재 제품
UI가 이 helper를 호출한다는 뜻은 아닙니다.

### Card Balance Account 조회

`getCardBalanceAccount`는
`GET /v1/card-balance-accounts/{cardBalanceAccountId}`를 호출하고 성공 data를 generated
`CardBalanceAccount`로 반환합니다. 읽기 요청이므로 mutation header를 만들지 않습니다. 인증,
권한, not-found 등 실패는 백엔드의 선언된 `ErrorEnvelope`를 거쳐 `FrontendHttpError`가 됩니다.

### Wish

| helper | HTTP 계약 | 성공 data와 중요한 조건 |
| --- | --- | --- |
| `listWishes` | `GET /v1/card-balance-accounts/{id}/wishes` | 선택적 `cursor`, `limit`, `state` query를 받고 `WishPage` 반환 |
| `getWish` | `GET /v1/card-balance-accounts/{id}/wishes/{wishId}` | `Wish` 반환 |
| `createWish` | `POST /v1/card-balance-accounts/{id}/wishes` | generated JSON body와 필수 `Idempotency-Key`, `WishMutationResult` 반환 |
| `patchWish` | `PATCH /v1/card-balance-accounts/{id}/wishes/{wishId}` | `application/merge-patch+json` body, `WishMutationResult` 반환 |
| `deleteWish` | `DELETE /v1/card-balance-accounts/{id}/wishes/{wishId}` | 필수 `Idempotency-Key`와 `If-Match`, `WishMutationResult` 반환 |

백엔드가 replay 결과에 `Idempotency-Replayed`를 보내면 BFF는 이 header를 노출할 수 있습니다.
이는 성공 body를 대체하지 않습니다. 충돌, 필수 header 누락, 인증, 권한, 입력·상태 규칙 위반은
각 operation에 선언된 status와 nested `ErrorEnvelope`로 처리하며 helper가 임의 상태나 메시지를
추가하지 않습니다.

## profile과 자격 증명 신뢰 경계

미병합 구현의 `APP_ENV`는 `local`, `e2e`, `staging`, `prod`, `BACKEND_PROFILE`은 `e2e`, `demo`,
`prod` 중 하나이며 허용 조합만 사용할 수 있습니다. `e2e`와 `demo`는 서로 다른 cookie name과
token registry를 사용하고 token 값의 중복·공백·제어 문자를 거부합니다. `prod` profile은 persona
cookie, persona route, server token registry를 활성화하지 않습니다.

persona route는 `POST`로 허용된 persona를 선택해 HttpOnly, SameSite=Lax cookie를 설정하고
`DELETE`로 지웁니다. 활성 namespace와 다른 route는 `404`입니다. cookie에는 persona key만 있고
bearer token은 서버 환경에만 있습니다. 브라우저가 보낸 bearer token이나 임의 cookie를
백엔드 credential로 신뢰하지 않습니다.

## 한계와 비주장

- 프론트엔드 `main`에는 제품 UI의 backend 연동, OpenAPI snapshot, generated client,
  `src/lib/http`가 없습니다.
- typed HTTP, profile, persona, credential injection은 `4f5cdb97`의 미병합 구현입니다. 병합, 배포,
  출시 또는 사용자 이용 가능 상태라고 주장하지 않습니다.
- 이 revision은 React Query나 제품 hook의 cache, retry, invalidation, optimistic update 정책을
  정의하지 않습니다.
- 이 문서는 HTTP operation, schema, 인증, header, profile policy 또는 런타임 동작을 새로
  보장하지 않습니다. 충돌하면 고정된 구현과 백엔드 OpenAPI를 따릅니다.
- GitHub Wiki 게시 여부는 이 저장소 변경과 별개입니다. 이후 정확히 바인딩된 게시 작업과
  byte-equal authoritative read-back이 있어야 동기화 완료로 볼 수 있습니다.
