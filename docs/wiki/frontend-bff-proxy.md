# 프론트엔드 BFF 프록시

프론트엔드는 `/api/backend/[...path]`에 동일 출처 Backend-for-Frontend(BFF) 경로를 제공합니다. 브라우저 코드는 백엔드 오리진을 직접 알 필요 없이 이 경로를 호출합니다. Route Handler는 서버 런타임 설정을 검증하고 제한된 전달 정책을 적용한 뒤, 애플리케이션 페이로드를 해석하지 않고 백엔드 상태와 본문을 반환합니다.

이 Markdown 파일은 전용
[Frontend-BFF-Proxy Wiki 페이지](https://github.com/crabitteam2/crabit-frontend/wiki/Frontend-BFF-Proxy)를
편집할 때 사용하는 기준 원본입니다. 관련 가이드는
[저장소 문서 지도](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/home.md)에서
찾을 수 있습니다. Wiki는 독자용 미러입니다. 이 파일이 있다고 해서 해당 페이지의 게시 또는
동기화가 완료된 것은 아닙니다.

## 요청 흐름

```text
Browser -> /api/backend/<path> -> Next.js Route Handler -> configured backend
```

`APP_ENV`, `BACKEND_PROFILE`, `BACKEND_URL`, persona token, 조합된 백엔드 대상과 검증 세부 정보는 서버에만 남습니다. Client Components에서 `src/config/env.ts`, `src/config/persona-tokens.ts` 또는 서버 HTTP adapter를 import하면 안 됩니다.

## 런타임 설정

세 변수는 모두 필수이며 대소문자를 구분합니다. `NODE_ENV`와는 독립적으로 동작합니다.

| 변수 | 허용 값 |
| --- | --- |
| `APP_ENV` | 정확히 `local`, `e2e`, `staging`, `prod` 중 하나 |
| `BACKEND_PROFILE` | 정확히 `e2e`, `demo`, `prod` 중 하나이며 profile matrix가 허용하는 `APP_ENV` 조합만 사용 |
| `BACKEND_URL` | 선택적인 포트를 포함할 수 있고 경로는 루트만 허용하는 절대 백엔드 오리진 |

`BACKEND_URL`에는 자격 증명, 공백, 쿼리, 프래그먼트 또는 루트가 아닌 경로를 넣을 수 없습니다. `local`과 `e2e`에서는 HTTP와 HTTPS를 모두 허용합니다. `staging`과 `prod`에서는 HTTPS가 필수입니다.

안전한 예시:

```sh
APP_ENV=local BACKEND_PROFILE=prod BACKEND_URL=http://127.0.0.1:8080 npm run dev
APP_ENV=e2e BACKEND_PROFILE=e2e BACKEND_URL=http://127.0.0.1:18080 npm run start
APP_ENV=staging BACKEND_PROFILE=e2e BACKEND_URL=https://backend.staging.example npm run start
APP_ENV=prod BACKEND_PROFILE=demo BACKEND_URL=https://backend.example:8443 npm run start
```

`http://user:password@backend.example`, `https://backend.example/api`, `https://backend.example?tenant=crabit` 같은 값은 사용하지 마세요.

## 전달 계약

경로의 `/api/backend/` 뒤에는 세그먼트가 하나 이상 있어야 합니다.

| 메서드 | 동작 |
| --- | --- |
| `GET` | 요청 본문 없이 전달 |
| `POST`, `PUT`, `PATCH`, `DELETE` | 빈 본문을 포함해 들어온 본문 바이트 그대로 전달 |
| `HEAD`, `OPTIONS` | `405`로 거부하며 백엔드에는 요청하지 않음 |

각 경로 세그먼트는 디코딩한 뒤 검증하고 독립적으로 인코딩합니다. 빈 세그먼트, 점 세그먼트, 디코딩된 슬래시, 백슬래시, NUL 문자는 거부합니다. 쿼리 순서, 중복 키, 빈 값, 퍼센트 인코딩, 퍼센트 헥스 표기의 대소문자는 들어온 요청 대상 그대로 보존합니다.

BFF는 JSON, merge-patch, 텍스트, 바이너리 본문을 파싱하지 않으며 애플리케이션별 미디어 타입도 강제하지 않습니다.

### 요청 헤더

들어온 값 중 다음 헤더만 백엔드로 복사할 수 있습니다.

- `Accept`
- `Accept-Language`
- `Content-Type`
- `Idempotency-Key`
- `If-Match`

`Authorization`, `Cookie`, `Proxy-Authorization`, 브라우저의 `Host`, 메시지 프레이밍 필드, 전달 필드, 홉 단위 필드는 절대 복사하지 않습니다. 들어온 `Connection` 헤더가 이름으로 지정한 필드는 허용 목록에 있어도 제거합니다. HTTP 전송 계층은 자체 프레이밍 헤더나 연결 헤더를 만들 수 있지만, 제거한 브라우저 값은 다시 사용하지 않습니다.

BFF는 브라우저의 `Authorization`, `Cookie`, `Proxy-Authorization`을 전달하지 않습니다. 활성 `e2e` 또는 `demo` profile에서는 해당 profile의 canonical persona cookie만 읽고 대응하는 서버 전용 token namespace에서 key를 해석합니다. 유효한 key는 서버가 선택한 `Authorization: Bearer ...` 헤더 하나만 주입합니다. 누락, 중복, 손상, 미등록, 만료 또는 비활성 namespace의 cookie는 아무 credential도 주입하지 않으며 `owner`로 대체되지 않습니다.

검증된 첫 경로 세그먼트가 `e2e`이면 `BACKEND_PROFILE=e2e`에서만 전달합니다. Demo, production-backend와 그 밖의 비-E2E profile은 본문 읽기나 upstream 접근 전에 `404 BFF_NOT_FOUND`를 반환합니다.

### 백엔드 호출과 응답

백엔드 요청에는 10초 제한 시간과 `redirect: manual`, `cache: no-store` 설정을 적용합니다. 리디렉션은 따라가지 않습니다.

백엔드 상태와 응답 바이트는 그대로 보존합니다. 다만 업스트림 `Connection` 헤더가 해당 헤더 중 하나를 지정하지 않았을 때만 `Content-Type`, `WWW-Authenticate`, `Idempotency-Replayed`를 응답에 복사할 수 있습니다. `Set-Cookie`, `Location`, `Content-Length`, `Content-Encoding`, 백엔드 캐시 메타데이터, 홉 단위 필드와 그 밖의 모든 백엔드 헤더는 제거합니다. 모든 BFF 응답에는 `Cache-Control: no-store`를 설정합니다.

응답 본문을 허용하지 않는 상태는 null 본문으로 반환합니다. 백엔드의 `4xx`, `5xx` 응답은 일반적인 백엔드 응답이며 다시 작성하지 않습니다.

Typed feature helper는 BFF 경계 뒤의 동일 출처 응답을 정규화합니다. 정확한 backend 또는 BFF error envelope만 받아 안전한 `ApiResult`를 반환하며, proxy 자체는 계속 응답 바이트를 보존하고 애플리케이션 payload를 해석하지 않습니다.

## Backend profile 가용성 경계

Backend revision `a3d01715dc075d8714b7ef973516944d92c7de33`에는 서로 분리된 E2E와 Demo 인증 filter, credential registry, fixture와 profile resource가 있습니다. Demo는 서버 전용 persona 설정 6개와 HTTP card-balance provider를 포함하고, E2E는 deterministic fixture, 고정 clock, scripted balance behavior와 `/e2e` control route를 포함합니다. 상호 배타적인 Demo profile은 E2E route나 deterministic script를 로드하지 않습니다.

저장소 배포 설계상 `develop`의 staging backend image는 E2E를, 보호된 `main`의 Stable Demo image는 Demo를 사용합니다. 이 source와 topology 근거는 배포 증거가 아닙니다. 이 프론트 구현에서는 image digest, 실행 중인 backend, HTTPS 연결성, runtime secret, database health 또는 배포된 end-to-end 요청을 검증하지 않았습니다.

## BFF가 생성하는 오류

BFF가 생성한 오류는 `application/json`, `Cache-Control: no-store`를 사용하며 정확히 `code`와 `message`만 포함합니다.

| 상태 | 코드 | 메시지 | 대표 원인 |
| --- | --- | --- | --- |
| `400` | `BFF_INVALID_REQUEST` | `BFF request is invalid` | 안전하지 않은 경로/대상 또는 읽을 수 없는 요청 본문 |
| `405` | `BFF_METHOD_NOT_ALLOWED` | `HTTP method is not allowed` | 명시적인 `HEAD` 또는 `OPTIONS` 요청 |
| `500` | `BFF_CONFIGURATION_ERROR` | `BFF configuration is invalid` | 유효하지 않은 profile 조합, URL 또는 persona registry |
| `404` | `BFF_NOT_FOUND` | `BFF route is not found` | E2E backend profile 밖에서 요청한 `/e2e/**` |
| `502` | `BFF_UPSTREAM_UNAVAILABLE` | `Backend service is unavailable` | 네트워크 실패 또는 10초 타임아웃 |

BFF가 생성한 응답과 로그에는 환경 변수 값, 백엔드 또는 대상 URL, 자격 증명, 파서 오류, 업스트림 예외 텍스트, 스택 트레이스를 포함하면 안 됩니다.

## 검증과 운영

설치와 일반 test, lint, build, start 명령은 이 문서에 중복해서 적지 않고
[프론트엔드 README](https://github.com/crabitteam2/crabit-frontend/blob/main/README.md)에서 관리합니다.
프로덕션 build를 마친 뒤 BFF 전용 smoke 검사를 실행하세요.

```sh
npm run smoke:bff
```

smoke 명령은 프로덕션 build 다음에 실행합니다. 이 명령은 제어된 로컬 업스트림과 빌드된 Next.js 서버를 시작하고, 대표적인 전달, 제거, 리디렉션, 거부, 바이트 보존 동작을 검사한 뒤 두 프로세스를 모두 종료합니다. 실제 Spring 백엔드의 성공 경로를 검증한 것으로 간주하지 않습니다.

## 문제 해결 및 보안 원칙

- `500 BFF_CONFIGURATION_ERROR`는 설정이 거부됐다는 뜻입니다. 정확한 `APP_ENV`/`BACKEND_PROFILE` 조합, 활성 token namespace의 완전성과 유일성, URL scheme, 루트 전용 경로, 공백·자격 증명·쿼리·프래그먼트가 없는지 확인하세요. 응답에서는 거부된 값을 의도적으로 제외합니다.
- `502 BFF_UPSTREAM_UNAVAILABLE`는 백엔드가 제한 시간 안에 요청을 완료하지 못했다는 뜻입니다. Next.js 서버 환경에서 백엔드에 연결할 수 있는지와 DNS를 확인하세요.
- 유효한 활성 persona cookie가 없으면 backend 인증 응답이 오는 것이 정상입니다. 브라우저 credential은 의도적으로 제거되며 서버가 선택한 credential을 대체하지 않습니다.
- 리디렉션은 `Location` 없이 원래 상태와 본문 그대로 브라우저에 도달하며 BFF는 이를 따라가지 않습니다.
- token 변수에 `NEXT_PUBLIC_` 접두사를 붙이거나, token이나 설정된 origin을 브라우저 payload에 노출하거나, credential 전달을 추가하거나, 새 계약 검토 없이 header/path 정책을 완화하면 안 됩니다.
