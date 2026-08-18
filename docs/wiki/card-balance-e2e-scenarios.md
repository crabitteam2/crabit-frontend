# Card Balance E2E Scenarios

카드 잔액 조회 결과를 E2E 테스트마다 결정적으로 제어하는 방법을 설명한다. 이 기능은 `e2e` Spring 프로필에서만 열리는 테스트 제어면이며 공개 `/v1` API나 `api/openapi.yaml` 계약이 아니다.

이 Markdown 파일은
[Card-Balance-E2E-Scenarios Wiki 페이지](https://github.com/crabitteam2/crabit-frontend/wiki/Card-Balance-E2E-Scenarios)의
편집 원본이다. 관련 문서는
[저장소 문서 지도](https://github.com/crabitteam2/crabit-frontend/blob/main/docs/wiki/home.md)에서 찾는다.
GitHub Wiki는 독자용 게시본이며, 이 파일만 존재한다고 게시나 동기화가 완료된 것은 아니다.

## 사전 조건

- 백엔드를 `e2e` 프로필로 실행한다. 다른 프로필에서는 시나리오 컨트롤러와 라우트 자체가 존재하지 않는다.
- Node.js와 의존성 설치는 [프론트엔드 README](https://github.com/crabitteam2/crabit-frontend/blob/main/README.md)의 요구 사항과 quickstart를 따른다.
- API base는 자격 증명, 쿼리, fragment가 없는 절대 `http` 또는 `https` URL이어야 한다.
- 테스트마다 `crypto.randomUUID()`로 새 계정 ID를 만든다. 공용 Seed 계정 ID를 재사용하지 않는다.

직접 백엔드를 호출할 때의 예시는 `http://127.0.0.1:18080`이다. 기존 Next.js BFF를 통과할 때는 `http://127.0.0.1:3000/api/backend`처럼 base path까지 포함한다. 공용 클라이언트가 base path를 보존하면서 `/e2e/card-balance-accounts/{id}/balance-scenario`를 이어 붙인다.

## CLI 설정

CLI 플래그가 환경 변수보다 우선한다. API base는 `--api-base` 또는 `E2E_API_BASE_URL`, 계정 UUID는
`--account-id` 또는 `E2E_CARD_BALANCE_ACCOUNT_ID`로 지정할 수 있다. 옵션, 기본값, validation의 현재
기준은 문서에 복제하지 않고 실행 파일의 도움말로 확인한다.

```bash
npm run e2e:balance -- --help
```

아래 예시는 다음처럼 API base와 테스트 전용 새 계정 UUID를 설정했다고 가정한다. BFF를 검증할 때는
API base를 `http://127.0.0.1:3000/api/backend`로 바꾼다.

```bash
export E2E_API_BASE_URL=http://127.0.0.1:18080
export E2E_CARD_BALANCE_ACCOUNT_ID="$(node -e 'console.log(crypto.randomUUID())')"
```

## 프리셋

모든 `put`은 기존 큐에 추가하지 않고 해당 계정의 전체 시나리오를 원자적으로 교체한다.

```bash
# 같은 성공 잔액 1회(기본 count=1)
npm run e2e:balance -- put --preset steady-success --balance 100000

# 같은 성공 잔액 3회
npm run e2e:balance -- put --preset steady-success --balance 100000 --count 3

# 증가: from < to
npm run e2e:balance -- put --preset increase --from-balance 100000 --to-balance 125000

# 감소: to < from
npm run e2e:balance -- put --preset decrease --from-balance 125000 --to-balance 90000

# 조회 실패 1회
npm run e2e:balance -- put --preset failure

# 실패 후 지정 잔액으로 회복
npm run e2e:balance -- put --preset failure-then-recovery --balance 125000
```

잔액은 `0`부터 JavaScript 최대 안전 정수 `9007199254740991`까지의 정수여야 한다. `increase`와 `decrease`의 방향 조건이 맞지 않으면 HTTP 요청 전에 실패한다.

## 임의 순서 스텝

`--step`을 반복하면 등장 순서를 그대로 보존한다. 프리셋과 함께 사용할 수 없다.

```bash
npm run e2e:balance -- put \
  --step SUCCESS:100000 \
  --step FAILURE \
  --step SUCCESS:125000
```

`SUCCESS:<balance>`와 `FAILURE`만 허용한다. `FAILURE`에는 balance를 붙일 수 없다.

## 조회와 정리

```bash
npm run e2e:balance -- get
npm run e2e:balance -- delete
```

`get`은 남은 스텝을 소비하지 않는다. 실제 카드 잔액 provider 조회가 첫 스텝을 한 번 소비하며, 마지막 스텝까지 소비되면 다음 `get`은 `steps: []`를 반환한다. 스크립트가 없거나 소진된 provider 조회는 기존 결정적 실패 결과를 유지한다.

`delete`는 해당 계정만 비우며 이미 비어 있어도 성공한다. 전체 계정을 지우는 HTTP API는 제공하지 않는다.

## 백엔드 HTTP 동작 요약

이 절은 프론트엔드 도구 사용을 위한 요약이며 별도 API 계약이 아니다. 아래 내용은 바인딩된 백엔드
revision `49b8f12c413c6cd77c5028227ac2fa7b57651772`를 기준으로 한다. 라우트, 요청 처리, status의
권위 있는 근거는 해당 revision의
[`CardBalanceScenarioController`](https://github.com/crabitteam2/crabit-backend/blob/49b8f12c413c6cd77c5028227ac2fa7b57651772/src/main/java/com/crabit/backend/e2e/CardBalanceScenarioController.java)와
[`CardBalanceScenarioControllerIT`](https://github.com/crabitteam2/crabit-backend/blob/49b8f12c413c6cd77c5028227ac2fa7b57651772/src/test/java/com/crabit/backend/e2e/CardBalanceScenarioControllerIT.java),
인증 경계는
[`SeedAuthenticationIT`](https://github.com/crabitteam2/crabit-backend/blob/49b8f12c413c6cd77c5028227ac2fa7b57651772/src/test/java/com/crabit/backend/e2e/SeedAuthenticationIT.java)를
따른다. 카드 잔액 provider와 persistence 동작의 설명은
[`deterministic-card-balance.md`](https://github.com/crabitteam2/crabit-backend/blob/49b8f12c413c6cd77c5028227ac2fa7b57651772/docs/wish/deterministic-card-balance.md)에 있다.

라우트는 `/e2e/card-balance-accounts/{cardBalanceAccountId}/balance-scenario`이다.

- `PUT application/json`: 비어 있지 않은 `steps` 배열로 전체 큐를 교체하고 `200` JSON을 반환한다.
- `GET`: 남은 큐의 비소비 스냅샷을 `200` JSON으로 반환한다. 없거나 소진됐으면 빈 배열이다.
- `DELETE`: 계정 하나를 멱등하게 비우고 body 없는 `204`를 반환한다.

성공 스텝은 정확히 `{ "type": "SUCCESS", "balance": 100000 }`, 실패 스텝은 정확히 `{ "type": "FAILURE" }` 형태다. 잘못된 UUID/JSON은 `400`, PUT의 잘못된 media type은 `415`, 의미적으로 잘못된 시나리오는 `422`로 응답한다.

## Playwright fixture

`tests/e2e/fixtures.mjs`의 `cardBalanceScenario` fixture는 각 테스트에 새 UUID를 할당하고, 테스트 시작 시 PUT한 뒤 `finally`에서 그 계정만 DELETE한다. 테스트 본문이 실패해도 정리를 시도하며 병렬 worker끼리 공용 계정이나 전역 reset을 공유하지 않는다.

```js
import { expect, test } from "./fixtures.mjs";

test("uses an isolated balance scenario", async ({ cardBalanceScenario }) => {
  const remaining = await cardBalanceScenario.client.get(
    cardBalanceScenario.accountId,
  );
  expect(remaining.steps).toEqual([{ type: "SUCCESS", balance: 100000 }]);
});
```

기본 controlled server 검증은 별도 백엔드 없이 실행된다.

```bash
npx playwright test
```

실제 `e2e` 백엔드나 BFF를 검증하려면 `E2E_API_BASE_URL`을 설정한다. 설정 시 Playwright는 로컬 controlled server를 띄우지 않는다.

## 문제 해결

- `API base is required`: `--api-base` 또는 `E2E_API_BASE_URL`을 설정한다.
- `Account ID is required`: 공유 Seed ID 대신 새 UUID를 `--account-id`나 `E2E_CARD_BALANCE_ACCOUNT_ID`로 전달한다.
- `HTTP 404`: 백엔드가 `e2e` 프로필인지, BFF base에 `/api/backend`가 포함됐는지 확인한다.
- `HTTP 401/403`: 정확한 시나리오 GET/PUT/DELETE 라우트의 정상 결과가 아니다. URI, method, API base가 맞는지와 `/v1/**`로 잘못 요청했는지 확인한다. `e2e` 프로필의 정확한 시나리오 라우트만 Seed bearer 인증을 우회하며, 다른 프로필에서는 보통 `404`가 발생한다.
- `HTTP 422`: 빈 배열, 잘못된 step discriminator, `FAILURE`의 balance, 음수/소수/안전 범위 밖 잔액을 확인한다.
- malformed response 오류: 성공 status라도 계정 UUID와 엄격한 step envelope가 계약과 다르면 클라이언트가 실패 처리한다.
