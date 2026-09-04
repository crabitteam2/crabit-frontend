export interface paths {
    "/internal/v1/academies/{academyId}/behavior-metrics/feed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 피드 정렬 출처 및 위치별 행동 지표 조회
         * @description 머신 통합이 활성화된 경우에만 제공하며 기존 recommendation handoff trigger credential을 사용합니다. Authorization 헤더는 정확히 하나여야 하고 학생·receiver·잘못된·중복 자격증명은 401입니다. 이 세 GET 경로만 정확히 매칭하며 POST recommendation-handoffs 동작은 유지합니다. 잘못된 메서드나 추가 경로에 학생 필터 우회를 적용하지 않습니다. 학원 존재 및 이벤트별 현재 actor·카드 가시성을 재검증합니다. 노출과 클릭이 각각 발생 시각 반개구간·논리 보존·현재 접근을 통과해야 하며 불변 actor/impression·맥락·카드·위치로 결합합니다. 카드·위치·도착 순서만으로 결합하지 않습니다. 발생 시각은 [fromInclusive, toExclusive)이며 asOf 이후를 제외합니다. receivedAt <= asOf -90일은 물리 삭제 전에도 제외합니다. 늦은 수신으로 종료 후 24시간까지 바뀔 수 있고 현재 접근 변경은 이후에도 영향을 줍니다. 백엔드 수집 활성화는 프런트 계측 여부를 보장하지 않으며 과거 GET에서 소급 생성하지 않습니다. 필수값 누락, null, 알 수 없는 필드, 중복 JSON 속성, 잘못된 타입 및 알 수 없거나 반복된 쿼리는 400 MALFORMED_REQUEST입니다. 성공과 오류 모두 Cache-Control: no-store입니다.
         */
        get: operations["getFeedBehaviorMetrics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/internal/v1/academies/{academyId}/behavior-metrics/students/{studentId}/author-interest/{authorStudentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 작성자로 향한 방문 관심 조회
         * @description 머신 통합이 활성화된 경우에만 제공하며 기존 recommendation handoff trigger credential을 사용합니다. Authorization 헤더는 정확히 하나여야 하고 학생·receiver·잘못된·중복 자격증명은 401입니다. 이 세 GET 경로만 정확히 매칭하며 POST recommendation-handoffs 동작은 유지합니다. 잘못된 메서드나 추가 경로에 학생 필터 우회를 적용하지 않습니다. 양쪽 학생의 현재 학원 소속과 양방향 차단 부재가 필요하며 실패는 PROFILE_NOT_FOUND입니다. 방향성 프로필 방문만 집계하며 클릭이나 카테고리 관심으로 대체하지 않습니다. 발생 시각은 [fromInclusive, toExclusive)이며 asOf 이후를 제외합니다. receivedAt <= asOf -90일은 물리 삭제 전에도 제외합니다. 늦은 수신으로 종료 후 24시간까지 바뀔 수 있고 현재 접근 변경은 이후에도 영향을 줍니다. 백엔드 수집 활성화는 프런트 계측 여부를 보장하지 않으며 과거 GET에서 소급 생성하지 않습니다. 필수값 누락, null, 알 수 없는 필드, 중복 JSON 속성, 잘못된 타입 및 알 수 없거나 반복된 쿼리는 400 MALFORMED_REQUEST입니다. 성공과 오류 모두 Cache-Control: no-store입니다.
         */
        get: operations["getOutgoingAuthorInterestMetrics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/internal/v1/academies/{academyId}/behavior-metrics/students/{studentId}/profile-visits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 들어온 프로필 방문 지표 조회
         * @description 머신 통합이 활성화된 경우에만 제공하며 기존 recommendation handoff trigger credential을 사용합니다. Authorization 헤더는 정확히 하나여야 하고 학생·receiver·잘못된·중복 자격증명은 401입니다. 이 세 GET 경로만 정확히 매칭하며 POST recommendation-handoffs 동작은 유지합니다. 잘못된 메서드나 추가 경로에 학생 필터 우회를 적용하지 않습니다. 대상의 현재 학원 소속을 확인하고 각 방문자의 현재 소속과 양방향 차단을 다시 평가합니다. 전체 기간 고유 방문자 수는 일별 고유 방문자의 합이 아닙니다. 발생 시각은 [fromInclusive, toExclusive)이며 asOf 이후를 제외합니다. receivedAt <= asOf -90일은 물리 삭제 전에도 제외합니다. 늦은 수신으로 종료 후 24시간까지 바뀔 수 있고 현재 접근 변경은 이후에도 영향을 줍니다. 백엔드 수집 활성화는 프런트 계측 여부를 보장하지 않으며 과거 GET에서 소급 생성하지 않습니다. 필수값 누락, null, 알 수 없는 필드, 중복 JSON 속성, 잘못된 타입 및 알 수 없거나 반복된 쿼리는 400 MALFORMED_REQUEST입니다. 성공과 오류 모두 Cache-Control: no-store입니다.
         */
        get: operations["getIncomingProfileVisitMetrics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/feed-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 피드 노출 및 클릭 기록
         * @description 맥락의 본인·학원 소유권, 실제 카드와 정확한 위치를 확인합니다. 없거나 타인·다른 학원·잘못된 카드 위치는 FEED_CONTEXT_NOT_FOUND입니다. 현재 구성원·계정·공개 범위·방향성 팔로우·양방향 차단·위시 상태를 재검증하고 비공개·삭제·포기 카드는 SHARED_CARD_NOT_FOUND입니다. 새 이벤트 receivedAt은 expiresAt보다 작아야 하며 occurredAt은 createdAt -5분 이상이어야 합니다. impressionId는 actor·맥락·카드·위치에 불변 결속되며 변경은 IMPRESSION_CONFLICT, 두 번째 노출 eventId는 IMPRESSION_ALREADY_EXPOSED입니다. 클릭이 먼저 결속할 수 있고 노출 없이도 유효합니다. 여러 실제 클릭은 서로 다른 eventId로 같은 impressionId를 사용합니다. 노출을 합성하지 않습니다. eventId는 현재 학생 범위에서 모든 행동 유형에 걸쳐 공유합니다. 현재 제출 범위와 보존 원본의 접근 권한을 먼저 재확인한 정확한 재생은 시간·맥락 만료 검사에 앞서 200과 Idempotency-Replayed: true로 최초 두 시각을 유지합니다. 불변값이 다르면 409 EVENT_ID_CONFLICT이며 원본 내용을 노출하지 않습니다. 최초 receivedAt부터 90일, 만료 경계는 제외합니다. 새 occurredAt은 receivedAt -24시간부터 +5분까지 양끝 포함이며 보정하지 않습니다. 동시 수락과 impression 유일성은 트랜잭션으로 보장합니다. 필수값 누락, null, 알 수 없는 필드, 중복 JSON 속성, 잘못된 타입 및 알 수 없거나 반복된 쿼리는 400 MALFORMED_REQUEST입니다. 성공과 오류 모두 Cache-Control: no-store입니다.
         */
        post: operations["createFeedEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/feed-results": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 피드 결과 맥락 생성
         * @description 기존 공유 카드의 현재 가시성, 사진 전달, contentUpdatedAt DESC, sharedCardId DESC 및 커서를 재사용합니다. 매 호출과 각 페이지마다 실제 전달 카드·페이지 내 위치·actor·학원·시각·LATEST를 저장한 24시간 맥락을 만듭니다. 빈 페이지도 새 맥락을 생성합니다. SharedCard와 기존 GET 계약은 바꾸지 않고 방문·노출·클릭도 생성하지 않습니다. 페이지 전달 실패를 부분 성공이나 수집 성공으로 바꾸지 않습니다. 필수값 누락, null, 알 수 없는 필드, 중복 JSON 속성, 잘못된 타입 및 알 수 없거나 반복된 쿼리는 400 MALFORMED_REQUEST입니다. 성공과 오류 모두 Cache-Control: no-store입니다.
         */
        post: operations["createFeedResult"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/followers": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        /**
         * 현재 같은 학원 팔로워 목록 조회
         * @description 인증된 학생의 현재 학원 소속을 요청마다 재검증합니다. 유효 관계는 현재 활성 방향성 팔로우, 상대방의 현재 학원 소속, 양방향 활성 차단 부재를 모두 충족합니다. 카드 계정 보유·활성·공개 자격은 요구하지 않습니다. isFollowedBy는 true이며 isFollowing은 독립적인 본인 → 상대방 관계입니다. items, 양방향 상태 및 두 카운트는 요청 내 일관된 데이터베이스 스냅샷에서 읽습니다. followingCount와 followerCount는 선택 학원의 모든 유효 관계 수이며 nickname, cursor, limit, 로드된 행 수에 영향을 받지 않습니다. 검색 결과가 비어도 전체 카운트는 0이 아닐 수 있습니다. followedAt DESC, studentId DESC로 정렬합니다. 커서는 인증된 학생, 학원, 작업 및 목록 방향, 정규화된 닉네임 또는 명시적 필터 없음 표식, 커서·정렬 버전, 최초 탐색 경계, 마지막 followedAt·studentId 튜플에 바인딩됩니다. 다음 페이지는 마지막 튜플 아래의 엄격한 keyset 조건을 적용합니다. 최초 탐색 경계를 유지하여 새로 생성되거나 종료 후 다시 시작된 관계는 새로고침에서만 나타납니다. 타임스탬프가 같거나 반올림되어도 새 활성화를 구분하여 이전 탐색에 섞이지 않게 합니다. 매 페이지에서 현재 관계·소속·닉네임·양방향 차단을 재검증하여 종료·차단·탈퇴한 행은 사라집니다. 안정된 관계와 검색 데이터는 중복·누락 없이 순회하며 그 밖의 실시간 변경에 대해 과거 스냅샷을 약속하지 않습니다. 형식·인코딩 오류, 위조 또는 컨텍스트 불일치 커서는 부분 페이지 없이 400 MALFORMED_REQUEST와 cursor 필드 오류를 반환합니다. 유효한 limit 변경은 커서를 무효화하지 않습니다.
         */
        get: operations["listAcademyFollowers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/following": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        /**
         * 현재 같은 학원 팔로잉 목록 조회
         * @description 인증된 학생의 현재 학원 소속을 요청마다 재검증합니다. 유효 관계는 현재 활성 방향성 팔로우, 상대방의 현재 학원 소속, 양방향 활성 차단 부재를 모두 충족합니다. 카드 계정 보유·활성·공개 자격은 요구하지 않습니다. isFollowing은 true이며 isFollowedBy는 독립적인 상대방 → 본인 관계입니다. items, 양방향 상태 및 두 카운트는 요청 내 일관된 데이터베이스 스냅샷에서 읽습니다. followingCount와 followerCount는 선택 학원의 모든 유효 관계 수이며 nickname, cursor, limit, 로드된 행 수에 영향을 받지 않습니다. 검색 결과가 비어도 전체 카운트는 0이 아닐 수 있습니다. followedAt DESC, studentId DESC로 정렬합니다. 커서는 인증된 학생, 학원, 작업 및 목록 방향, 정규화된 닉네임 또는 명시적 필터 없음 표식, 커서·정렬 버전, 최초 탐색 경계, 마지막 followedAt·studentId 튜플에 바인딩됩니다. 다음 페이지는 마지막 튜플 아래의 엄격한 keyset 조건을 적용합니다. 최초 탐색 경계를 유지하여 새로 생성되거나 종료 후 다시 시작된 관계는 새로고침에서만 나타납니다. 타임스탬프가 같거나 반올림되어도 새 활성화를 구분하여 이전 탐색에 섞이지 않게 합니다. 매 페이지에서 현재 관계·소속·닉네임·양방향 차단을 재검증하여 종료·차단·탈퇴한 행은 사라집니다. 안정된 관계와 검색 데이터는 중복·누락 없이 순회하며 그 밖의 실시간 변경에 대해 과거 스냅샷을 약속하지 않습니다. 형식·인코딩 오류, 위조 또는 컨텍스트 불일치 커서는 부분 페이지 없이 400 MALFORMED_REQUEST와 cursor 필드 오류를 반환합니다. 유효한 limit 변경은 커서를 무효화하지 않습니다.
         */
        get: operations["listAcademyFollowing"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/following/{studentId}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 관계 상대방의 UUID입니다. 인증된 소유자 정보는 항상 현재 인증 주체에서 가져오며 이 매개변수로 받지 않습니다. */
                studentId: components["parameters"]["StudentId"];
            };
            cookie?: never;
        };
        get?: never;
        /**
         * 같은 학원 학생 팔로우
         * @description 선택한 학원에서 본인 → 대상 관계만 생성합니다. 유효 대상을 이미 팔로우하면 followedAt과 카운트를 변경하지 않고 204입니다. 실제 종료 후 재팔로우하면 시계 정밀도로 시각이 같아도 새 활성화와 정렬 위치를 얻습니다. 인증된 학생의 현재 학원 소속을 요청마다 재검증합니다. 유효 관계는 현재 활성 방향성 팔로우, 상대방의 현재 학원 소속, 양방향 활성 차단 부재를 모두 충족합니다. 카드 계정 보유·활성·공개 자격은 요구하지 않습니다. 없는 학생, 현재 같은 학원 구성원이 아닌 대상, 어느 방향이든 활성 차단이 있는 대상은 누가 차단했는지 구분할 수 없는 동일한 메시지와 details의 404 STUDENT_NOT_FOUND입니다. 자신을 대상으로 하면 409 SELF_RELATIONSHIP입니다. 영구 Idempotency-Key나 expectedVersion은 받지 않습니다. 팔로우·언팔로우의 중복 성공은 과거 결과 재생이 아닌 현재 상태의 no-op입니다. 겹치는 유효 요청은 서버 직렬화 순서대로 처리하며 마지막 유효 요청이 현재 상태를 결정합니다. 언팔로우 뒤 지연된 팔로우 재시도는 새 관계를 만들 수 있습니다. 같은 상대방에 대한 클라이언트 변경 요청은 순차 실행해야 하며 기기 간 순서는 서버 처리 순서만 보장합니다. 팔로우·언팔로우·차단·차단 해제는 전역 학생 쌍 단위로 일관되게 직렬화하고 관계 변경과 같은 트랜잭션에서 양방향 차단을 재검증합니다.
         */
        put: operations["followAcademyStudent"];
        post?: never;
        /**
         * 같은 학원 학생 언팔로우
         * @description 선택한 학원의 본인 → 대상 관계만 종료합니다. 반대 방향과 다른 학원의 관계는 유지합니다. 유효 대상과 현재 관계가 없어도 204입니다. 대상 유효성을 먼저 검사하므로 숨겨진 대상·차단 대상은 관계 부재 no-op보다 우선하여 STUDENT_NOT_FOUND입니다. 인증된 학생의 현재 학원 소속을 요청마다 재검증합니다. 유효 관계는 현재 활성 방향성 팔로우, 상대방의 현재 학원 소속, 양방향 활성 차단 부재를 모두 충족합니다. 카드 계정 보유·활성·공개 자격은 요구하지 않습니다. 없는 학생, 현재 같은 학원 구성원이 아닌 대상, 어느 방향이든 활성 차단이 있는 대상은 누가 차단했는지 구분할 수 없는 동일한 메시지와 details의 404 STUDENT_NOT_FOUND입니다. 자신을 대상으로 하면 409 SELF_RELATIONSHIP입니다. 영구 Idempotency-Key나 expectedVersion은 받지 않습니다. 팔로우·언팔로우의 중복 성공은 과거 결과 재생이 아닌 현재 상태의 no-op입니다. 겹치는 유효 요청은 서버 직렬화 순서대로 처리하며 마지막 유효 요청이 현재 상태를 결정합니다. 언팔로우 뒤 지연된 팔로우 재시도는 새 관계를 만들 수 있습니다. 같은 상대방에 대한 클라이언트 변경 요청은 순차 실행해야 하며 기기 간 순서는 서버 처리 순서만 보장합니다. 팔로우·언팔로우·차단·차단 해제는 전역 학생 쌍 단위로 일관되게 직렬화하고 관계 변경과 같은 트랜잭션에서 양방향 차단을 재검증합니다.
         */
        delete: operations["unfollowAcademyStudent"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/profile-visits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 프로필 방문 기록
         * @description 현재 인증 주체에서 방문자를 결정하고 활성 학원 소속을 확인합니다. 대상의 현재 학원 소속과 양방향 차단 부재를 확인하며 숨겨진 대상은 PROFILE_NOT_FOUND입니다. 본인 방문은 저장 없이 SELF_PROFILE_VISIT입니다. 새로고침·뒤로 가기 재진입을 포함한 실제 프로필 경로 진입마다 기록하고 렌더링·refetch·prefetch·탭 재포커스·재전송은 새 방문으로 세지 않습니다. 서로 다른 진입에는 세션 억제를 적용하지 않고 작성자 관심만 기록합니다. eventId는 현재 학생 범위에서 모든 행동 유형에 걸쳐 공유합니다. 현재 제출 범위와 보존 원본의 접근 권한을 먼저 재확인한 정확한 재생은 시간·맥락 만료 검사에 앞서 200과 Idempotency-Replayed: true로 최초 두 시각을 유지합니다. 불변값이 다르면 409 EVENT_ID_CONFLICT이며 원본 내용을 노출하지 않습니다. 최초 receivedAt부터 90일, 만료 경계는 제외합니다. 새 occurredAt은 receivedAt -24시간부터 +5분까지 양끝 포함이며 보정하지 않습니다. 동시 수락과 impression 유일성은 트랜잭션으로 보장합니다. 필수값 누락, null, 알 수 없는 필드, 중복 JSON 속성, 잘못된 타입 및 알 수 없거나 반복된 쿼리는 400 MALFORMED_REQUEST입니다. 성공과 오류 모두 Cache-Control: no-store입니다.
         */
        post: operations["createProfileVisit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/shared-cards": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        /**
         * 학원에서 현재 볼 수 있는 공유 카드 목록 조회
         * @description 조회할 때마다 학원 소속, 위시 visibility, 방향성 팔로우 관계, 양방향 차단을 다시 평가하고 ownerId를 생략하면 소유자 본인은 제외합니다. ownerId를 명시하면 해당 학생의 허용된 카드만 반환하며, 본인을 지정하면 현재 공개 중인 자기 카드도 조회합니다. PRIVATE 카드는 포함하지 않습니다. photoId, object key, 과거 signed URL은 이 권한 검사를 대신하지 않습니다. PRIVATE 위시는 카드를 생성하지 않으며 비공개 또는 과거 비공개 상태에서 포기한 위시는 소유자가 FOLLOWERS 또는 ACADEMY로 명시적으로 공개할 때까지 카드를 만들지 않습니다. 첨부 사진이 하나라도 있으면 모든 항목의 새 5분 비공개 URL을 발급한 뒤에만 전체 페이지를 반환하며 signing 실패는 부분 페이지나 거짓 null 없이 503입니다. 임시 정렬은 contentUpdatedAt DESC, sharedCardId DESC 순입니다. 현재는 정렬 매개변수를 지원하지 않습니다. 이 임시 정책에서는 콘텐츠 또는 게시 상태가 바뀔 때만 카드 순서가 달라집니다. 팔로우 우선순위와 임베딩 기반 추천 정렬은 향후 계약에서 정할 사항이며 이 버전에서는 사용하지 않습니다. FOLLOWERS는 선택 학원의 현재 viewer → owner 팔로우가 있어야 비소유자에게 공개됩니다. owner → viewer만으로는 공개되지 않으며 상호 팔로우는 필요하지 않습니다. 진행·완료·포기 공유 카드의 목록·상세에 동일하게 적용합니다. 기존 소유자 예외, PRIVATE·ACADEMY 의미, 현재 학원 소속, 공유 카드의 카드 계정 자격과 각 변형의 게시 규칙, 전역 양방향 차단 우선순위를 유지합니다. 현재 공개된 IN_PROGRESS 또는 AMOUNT_REACHED 위시를 포기하면 같은 sharedCardId의 PROGRESS 카드를 ABANDONMENT 카드 하나로 원자적으로 교체하고 contentUpdatedAt을 한 번만 갱신합니다. 그 포기 요청의 멱등 재생은 다른 카드나 추가 정렬 갱신을 만들지 않습니다. ABANDONMENT의 progressPercent는 포기 직전 고정된 적립액에서 한 번 계산한 공개 값이며 현재 0원 배정이나 정확한 과거 금액은 반환하지 않습니다. 포기 카드는 추천 후보나 대표 위시가 아닙니다. 언팔로우·차단 후 다음 조회부터 제한된 카드를 숨기며 직접 조회는 SHARED_CARD_NOT_FOUND 경계를 유지합니다. ownerId 조건은 SQL LIMIT와 keyset pagination 전에 적용합니다. 대상이 없거나 다른 학원·탈퇴·차단 상태이거나 현재 볼 수 있는 카드가 없으면 이유를 구별하지 않고 items: [], nextCursor: null인 빈 페이지를 반환합니다. 모든 페이지에서 현재 조회자와 소유자의 학원 소속, 열린 카드 계정 자격, 공개 상태, 삭제 여부와 양방향 차단을 다시 평가합니다. 새 불투명 커서는 기존 relationship_cursor_key의 HMAC으로 서명하고 형식 version, operation=listAcademySharedCards, viewerId, academyId, ownerId 또는 명시적 무필터 표식, 마지막 contentUpdatedAt/sharedCardId 튜플을 묶습니다. 형식 오류·변조·미지원 버전·구형 무서명 커서 또는 작업·조회자·학원·작성자·필터 유무가 다른 커서는 400 MALFORMED_REQUEST이며 cursor를 제거하고 첫 페이지부터 다시 조회해야 합니다. 같은 문맥의 유효한 cursor는 유효한 limit 변경을 허용합니다. 권한을 커서에 저장해 재사용하지 않습니다. 안정된 데이터는 중복·누락 없이 순회하지만 동시 콘텐츠 변경이나 완료·포기 카드 교체에 대한 스냅샷 보장은 없습니다. 학생 단건 조회와 목록 사이에도 원자적 스냅샷을 보장하지 않습니다.
         */
        get: operations["listAcademySharedCards"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/shared-cards/{cardId}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                cardId: components["parameters"]["SharedCardId"];
            };
            cookie?: never;
        };
        /**
         * 현재 볼 수 있는 공유 카드 조회
         * @description 소유자는 자신의 카드가 현재 공개 상태라면 조회할 수 있습니다. 다른 호출자는 현재 학원 소속, 위시 visibility, 방향성 팔로우 관계와 양방향 차단을 매번 다시 통과해야 하며 photoId나 과거 signed URL은 권한을 부여하지 않습니다. 사진이 있으면 새 5분 비공개 URL 세 개를 모두 발급한 뒤 반환하고 signing 실패는 거짓 null 없이 503입니다. 이미 발급된 URL은 접근이 철회되어도 최대 기존 5분 만료까지만 유효할 수 있고 새 URL은 발급하지 않습니다. 그 밖의 리소스 부재나 공개 범위 조건 위반은 모두 숨깁니다. FOLLOWERS는 선택 학원의 현재 viewer → owner 팔로우가 있어야 비소유자에게 공개됩니다. owner → viewer만으로는 공개되지 않으며 상호 팔로우는 필요하지 않습니다. 진행·완료·포기 공유 카드의 목록·상세에 동일하게 적용합니다. 기존 소유자 예외, PRIVATE·ACADEMY 의미, 현재 학원 소속, 공유 카드의 카드 계정 자격과 각 변형의 게시 규칙, 전역 양방향 차단 우선순위를 유지합니다. 공개된 진행 카드를 포기하면 같은 sharedCardId의 ABANDONMENT 카드로 원자적으로 교체하며 공개 progressPercent는 포기 직전 고정된 적립액에서 한 번 계산됩니다. 정확한 과거 금액, 포기 뒤 현재 0원 배정, 위시·계정 식별자는 이 응답에 포함하지 않습니다. 비공개 또는 과거 비공개 포기 위시는 명시적으로 공개되기 전까지 조회할 카드가 없고, 삭제하거나 PRIVATE로 바꾸면 카드를 제거합니다. 언팔로우·차단 후 다음 조회부터 제한된 카드를 숨기며 직접 조회는 SHARED_CARD_NOT_FOUND 경계를 유지합니다.
         */
        get: operations["getAcademySharedCard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/students": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        /**
         * 닉네임으로 현재 같은 학원 학생 검색
         * @description 저장된 NFC 정규화 닉네임을 대상으로 대소문자를 구분하는 연속 유니코드 코드 포인트 부분 문자열을 검색해 인증된 학생과 같은 학원의 현재 구성원을 찾습니다. 인증된 학생 본인, 현재 구성원이 아닌 학생, 어느 방향으로든 활성 차단이 있는 후보는 제외합니다. 각 결과에는 본인 → 상대방 isFollowing과 상대방 → 본인 isFollowedBy를 독립적으로 계산합니다. 카드 계정 보유·활성·공개 자격은 요구하지 않습니다. 결과는 nickname ASC, studentId ASC 순으로 정렬합니다. 불투명 커서는 이 작업, 인증된 학생, 학원, 정렬 버전, 정규화된 닉네임 필터, 마지막 정렬 튜플에 바인딩됩니다. 형식이 잘못되었거나 작업·행위자·학원이 다르거나 필터가 일치하지 않는 커서는 부분 페이지 없이 400을 반환합니다. 다음 페이지는 마지막 튜플 직후부터 이어지며 유효한 커서에는 유효한 limit 값을 함께 사용할 수 있습니다.
         */
        get: operations["searchAcademyStudents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/students/{studentId}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 관계 상대방의 UUID입니다. 인증된 소유자 정보는 항상 현재 인증 주체에서 가져오며 이 매개변수로 받지 않습니다. */
                studentId: components["parameters"]["StudentId"];
            };
            cookie?: never;
        };
        /**
         * 현재 같은 학원 학생의 신원과 관계 조회
         * @description 현재 인증 학생과 대상 학생 모두 해당 학원에 속하고 양방향 차단이 없어야 합니다. 카드 계정 보유 여부는 요구하지 않습니다. 정확한 자기 studentId 조회는 현재 학원 소속 조건을 통과하면 허용하며 isFollowing과 isFollowedBy는 모두 false입니다. 기존 닉네임 검색은 계속 본인을 제외합니다. 학원 접근 실패는 ACADEMY_NOT_FOUND, 없는 학생·다른 학원·탈퇴·양방향 차단은 동일한 메시지와 details를 가진 STUDENT_NOT_FOUND로 숨기며 차단 주체나 원인을 구별하지 않습니다. 잘못된 path UUID는 400 MALFORMED_REQUEST입니다. 자기 조회에는 SELF_RELATIONSHIP 409를 적용하지 않습니다. 관계와 개인정보는 Cache-Control: no-store로 반환합니다.
         */
        get: operations["getAcademyStudent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        /**
         * 소유한 카드 잔액 계정 조회
         * @description 현재 저장된 프로젝션에서 인증된 학생의 활성 계정을 반환합니다. 임의 식별자, 종료된 계정, 소유권 불일치, 학원 불일치는 모두 같은 리소스 없음 응답으로 숨깁니다. 이 작업은 외부 잔액 조회를 수행하지 않으며 영속 상태를 변경하지 않습니다. UNKNOWN 금액은 null로 유지합니다. 조회에 성공한 뒤 후속 시도가 실패하면 lastRefreshStatus는 FAILED로 표시하되, 마지막으로 성공한 금액과 lastRefreshedAt은 유지합니다.
         */
        get: operations["getCardBalanceAccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/balance-refreshes": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 현재 카드 잔액 새로고침
         * @description 본문이 없는 USER_REQUESTED 조회입니다. 이 작업은 의도적으로 Idempotency-Key를 사용하지 않으며 잔액 조정 건이 OPEN이어도 허용됩니다. 응답은 처리 결과의 현재 조정 상태 플래그를 반환합니다.
         */
        post: operations["refreshCardBalance"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/card-balance-changes": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        /**
         * 변동액이 0이 아닌 불변 카드 잔액 변경 이력 조회
         * @description 변동액이 0 아닌 CARD_BALANCE_CHANGE 원장 이벤트를 만든 성공 관측만 반환합니다. 실패한 관측과 성공했지만 변동액이 0인 관측은 저장된 운영 사실로 남지만 금액 이력 항목은 아닙니다. 결과는 occurredAt DESC, eventId DESC 순으로 정렬합니다. 불투명 커서는 이 작업, 계정, 정렬 버전, 마지막 (occurredAt, eventId) 튜플에 바인딩됩니다. 유효하지 않거나 바인딩이 일치하지 않는 커서는 부분 페이지 없이 400을 반환합니다. 다음 페이지는 마지막 튜플보다 엄격히 뒤에 이어지며, eventId가 같은 타임스탬프의 순서를 안정화하므로 경계 앞에 정렬되는 새 이벤트가 생겨도 연속 지점은 바뀌지 않습니다. 유효한 커서에는 유효한 limit 값을 함께 사용할 수 있습니다. 권한과 소유권은 요청할 때마다 다시 평가하며 캐시 가능성을 보장하지 않습니다.
         */
        get: operations["listCardBalanceChanges"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/fund-movements": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        /**
         * 계정 단위 불변 자금 이동 이력 조회
         * @description 외부 카드 잔액 변경과 모든 위시 자금 이동을 포함해 불변 원장 이벤트마다 항목 하나를 반환합니다. 위시 이체는 두 위시 효과를 갖지만 계정 이력에서는 항목 하나입니다. 결과는 occurredAt DESC, eventId DESC 순으로 정렬합니다. 불투명 커서는 이 작업, 계정, 정렬 버전, 마지막 튜플에 바인딩됩니다. 형식이 잘못되었거나 바인딩이 일치하지 않는 커서는 부분 페이지 없이 400을 반환합니다. 다음 페이지는 마지막 튜플보다 엄격히 뒤에 이어지며, eventId가 같은 타임스탬프의 순서를 안정화하므로 경계 앞에 정렬되는 새 이벤트가 생겨도 연속 지점은 바뀌지 않습니다. 유효한 커서에는 유효한 limit 값을 함께 사용할 수 있습니다. 보정은 새 보상 이벤트로 기록하며 이전 이벤트를 수정하거나 삭제하지 않습니다. 권한과 소유권은 요청할 때마다 다시 평가하며 캐시 가능성을 보장하지 않습니다.
         */
        get: operations["listAccountFundMovements"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/recaps/monthly": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        /**
         * 소유한 계정의 완료된 월간 리캡 조회
         * @description 인증된 학생이 소유한 활성 카드 잔액 계정에서 Asia/Seoul 기준으로 완료된 월간 리캡 하나를 조회합니다. month를 생략하면 가장 최근 완료된 달을 선택합니다. 제공한 값은 정확한 YYYY-MM 형식이어야 하고 미래 또는 진행 중인 달, 반복되거나 알 수 없는 쿼리 매개 변수는 400 MALFORMED_REQUEST입니다. 유효 입금이 세 건 미만이면 transport 오류가 아닌 확정 NOT_ELIGIBLE 상태를 200으로 반환합니다. 생성 이력이 없거나 진행 중이거나 최종 실패한 경우도 200 상태 리소스이며, 재생성이 진행 중이거나 실패했더라도 이전 current 성공이 있으면 그 불변 버전을 SUCCEEDED로 계속 반환합니다. 내부 생성 오류, QA 메트릭, peer identity와 원장 행은 공개하지 않습니다.
         */
        get: operations["getMonthlyRecap"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/recaps/weekly": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        /**
         * 소유한 계정의 완료된 주간 리캡 조회
         * @description 인증된 학생이 소유한 활성 카드 잔액 계정에서 Asia/Seoul 기준으로 완료된 주간 리캡 하나를 조회합니다. weekStart를 생략하면 가장 최근 완료된 월요일~다음 월요일 기간을 선택합니다. 제공한 값은 월요일이어야 하고 미래 또는 진행 중인 주, 반복되거나 알 수 없는 쿼리 매개 변수는 400 MALFORMED_REQUEST입니다. 생성 이력이 없거나 진행 중이거나 최종 실패한 경우도 200 상태 리소스로 반환하며, 활동이 0인 성공 결과는 SUCCEEDED입니다. 재생성이 진행 중이거나 실패했더라도 이전 current 성공이 있으면 그 불변 버전을 SUCCEEDED로 계속 반환합니다. 성공 story는 저장된 wishId와 typeTitle을 기반으로 매 조회마다 현재 공유 카드 공개 범위, 논리 삭제, 양방향 차단, viewer에서 owner로의 팔로우와 학원 소속을 다시 검증해 허용된 ownerStudentId와 sharedCardId만 보강합니다. 허용되지 않은 story만 생략하며 저장된 결과는 바꾸지 않습니다.
         */
        get: operations["getWeeklyRecap"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/representative-wish": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        /**
         * 현재 대표 위시 조회
         * @description 현재 선택을 확인하기 전에 인증된 학생과, 그 학생이 소유한 같은 학원의 활성 카드 잔액 계정을 검증합니다. 선택된 삭제되지 않은 IN_PROGRESS 또는 AMOUNT_REACHED 위시는 기존 위시 스냅샷 형식으로 직접 반환합니다. 유효한 계정에 대표 위시가 없으면 본문 없이 204를 반환합니다. 잔액 조정 건이 OPEN이어도 조회할 수 있으며, 외부 잔액을 조회하거나 영속 상태를 변경하지 않습니다. 열린 계정에 활성 상태의 삭제되지 않은 위시가 정확히 하나면 해당 위시를 대표로 선택합니다. 두 번째 활성 위시를 만들어도 기존 대표는 유지합니다. 대표 위시가 완료·포기·삭제되면 기존 선택을 제거하고, 활성 상태의 삭제되지 않은 위시가 정확히 하나 남았을 때만 다른 위시를 자동 선택합니다. 계정을 종료하면 선택이 제거되고 이 작업은 CARD_BALANCE_ACCOUNT_NOT_FOUND를 반환합니다. 대표 선택은 소유 위시 정렬, 위시 공개 범위, 공유 카드, 피드 정렬, 알림, 원장 이력, 계정 잔액을 변경하지 않습니다.
         */
        get: operations["getRepresentativeWish"];
        /**
         * 대표 위시 선택
         * @description 계정의 기존 대표를 지정한 동일 계정의 활성 위시로 원자적으로 교체합니다. 현재 대표를 다시 선택하면 변경 없이 200으로 성공하며 위시의 updatedAt과 version을 유지합니다. 잔액 조정 건이 OPEN이어도 선택할 수 있고, 원장 이벤트, 알림 아웃박스 항목, 선택 이력, 위시 변경을 만들지 않습니다. 동시 선택은 계정 우선 잠금으로 직렬화됩니다. 마지막으로 커밋된 선택이 최종 선택이며, 성공 응답에는 각 요청이 커밋 시점에 선택한 위시가 담깁니다. 오류 우선순위는 고정됩니다. Bearer 자격 증명이 없거나 유효하지 않으면 401 AUTH_REQUIRED, 인증 주체가 학생이 아니면 403 FORBIDDEN을 반환합니다. 경로 UUID나 JSON 본문이 잘못되었거나, wishId가 없거나 타입이 잘못되었거나, 알 수 없는 요청 필드가 있으면 400 MALFORMED_REQUEST를 반환합니다. 계정이 없거나 종료되었거나 본인 소유가 아니거나 다른 학원 소속이면 위시 적격성을 공개하기 전에 404 CARD_BALANCE_ACCOUNT_NOT_FOUND를 반환합니다. 유효한 계정에서 위시가 없거나 논리 삭제되었거나 다른 계정 소속이면 수명 주기 상태와 관계없이 404 WISH_NOT_FOUND를 반환합니다. 동일 계정의 COMPLETED 또는 ABANDONED 위시는 409 INVALID_STATE_TRANSITION을 반환합니다. 비공개 위시와 현재 대표를 포함해 동일 계정의 IN_PROGRESS 또는 AMOUNT_REACHED 위시는 성공합니다. 선택은 소유 위시 정렬, 위시 공개 범위, 공유 카드, 피드 정렬, 알림, 원장 이력, 계정 잔액을 변경하지 않습니다.
         */
        put: operations["selectRepresentativeWish"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 동일 계정의 두 위시 간 자금 원자적 이체
         * @description 출발·도착 Wish snapshot과 각각의 private photo replay state를 이체 성공 결과와 함께 원자적으로 캡처합니다. 일치 재생은 두 상태를 URL 발급 전에 함께 평가합니다. 각 NO_PHOTO는 이후 현재 attachment와 무관하게 null을 유지하고, 각 ACTIVE_PHOTO는 캡처된 정확한 photoId가 같은 소유자와 정확한 위시에 유효하게 ATTACHED인 경우에만 새 5분 URL을 받습니다. 어느 한쪽이라도 PHOTO_REVOKED이면 다른 쪽 URL을 발급하거나 부분 본문을 반환하지 않고 전체 재생이 409 WISH_PHOTO_EXPIRED로 실패합니다. 모든 필요한 URL 중 하나라도 발급하지 못하면 receipt를 바꾸지 않고 전체 재생이 503 PHOTO_DELIVERY_UNAVAILABLE로 실패합니다. 성공 재생에만 Idempotency-Replayed true를 보냅니다.
         */
        post: operations["transferWishFunds"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        /**
         * 계정이 소유한 삭제되지 않은 위시 목록 조회
         * @description 불투명 커서를 사용하며 createdAt DESC, id DESC 순으로 정렬합니다. 각 위시는 카드 잔액 계정의 조회 시점 OPEN 잔액 조정 상태를 반환합니다. 첨부 사진이 하나라도 있으면 모든 항목의 새 5분 비공개 URL을 발급한 뒤에만 전체 페이지를 반환하며, signing 실패는 부분 페이지나 거짓 null 없이 503입니다.
         */
        get: operations["listWishes"];
        put?: never;
        /**
         * 초기 적립금이 0인 비공개 위시 생성
         * @description 잔액 정보가 UNKNOWN이거나 OPEN 잔액 불일치가 없을 때 amount 0, state IN_PROGRESS, visibility PRIVATE인 위시를 생성합니다. startDate와 targetDate는 각각 생략하거나 null로 지정할 수 있고, 둘 다 날짜이면 startDate가 targetDate보다 늦지 않아야 합니다. 역전된 날짜 범위는 새 멱등 기록이나 위시 변경을 만들기 전에 거부합니다. photoId가 생략되거나 null이면 사진 없이 만들고, UUID이면 인증된 학생 소유의 만료되지 않은 미첨부 Pending 사진을 새 위시에 원자적으로 첨부합니다. 성공한 첨부는 사진 업로드 receipt의 ACTIVE_SUCCESS를 유지하며 24시간 retainUntil을 소비·연장·교체하지 않습니다. 첨부 실패 시 위시와 attachment 모두 생성하지 않습니다. 새로 캡처하는 멱등 요청 식별에는 정규화된 startDate의 명시적 null 또는 ISO 달력 날짜와 photoId의 명시적 null 또는 UUID가 포함되므로, 같은 Idempotency-Key를 다른 startDate 또는 photoId와 사용하면 409 IDEMPOTENCY_KEY_REUSED입니다. 기능 도입 전에 성공한 키는 startDate가 null인 재시도 중 photoId도 동일한 경우에만 이전 식별 방식으로 재생하며, 이전 스냅샷에 startDate가 없어도 응답에는 startDate null을 명시합니다. 일치하는 Idempotency-Key의 이전 성공 결과는 현재 불일치 방어 조건보다 먼저 재생됩니다. 최초 성공에 사진이 있으면 private ACTIVE_PHOTO 상태가 그 정확한 photoId를 유효한 동안만 보존하고 재생 때 소유권과 같은 위시 attachment를 재검증하여 새 5분 URL을 발급합니다. 최초 성공에 사진이 없던 NO_PHOTO는 이후 현재 사진이 붙어도 대체하지 않고 photo null을 반환합니다. 원래 사진이 교체·제거·revocation·Wish 삭제·cleanup으로 무효화되면 식별자 없는 PHOTO_REVOKED가 되어 Wish 성공 본문 없이 409 WISH_PHOTO_EXPIRED를 반환합니다. 새 URL 발급만 실패하면 receipt를 바꾸지 않고 부분 성공 본문 없이 503 PHOTO_DELIVERY_UNAVAILABLE을 반환합니다. 성공 재생에만 Idempotency-Replayed true를 보냅니다. 응답 capability 발급은 commit 전에 완료하므로 signing 실패가 비멱등 commit을 모호하게 만들지 않습니다. 그 밖의 경우 OPEN 잔액 조정 건이 있으면 새 위시를 저장하기 전에 409 BALANCE_MISMATCH_LOCKED로 생성을 거부합니다.
         */
        post: operations["createWish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        /**
         * 소유한 삭제되지 않은 위시 조회
         * @description 위시가 속한 카드 잔액 계정의 조회 시점 OPEN 잔액 조정 상태를 반환합니다. OPEN 잔액 조정 건이 있어도 이 조회를 차단하지 않습니다. 사진이 있으면 현재 소유권을 다시 확인하고 새 5분 비공개 URL을 모두 발급한 뒤 반환하며 signing 실패는 거짓 null 없이 503입니다.
         */
        get: operations["getWish"];
        put?: never;
        post?: never;
        /**
         * 위시 논리 삭제
         * @description 최종 변경 결과를 반환합니다. 첨부 사진은 같은 domain transaction에서 즉시 접근 불가능한 DELETE_PENDING으로 바꾸고, 보존 중인 성공 업로드 receipt를 파괴적 정리 전에 REVOKED_SUCCESS로 변경하여 retainUntil까지 남깁니다. 동시에 소유자의 모든 Wish mutation receipt에서 그 photoId인 ACTIVE_PHOTO를 식별자 없는 PHOTO_REVOKED로 원자적으로 바꾼 뒤 삭제 성공 snapshot을 캡처합니다. 따라서 deleteWish 자체의 성공 receipt는 항상 NO_PHOTO를 저장하고 일치 재생은 이후 사진 상태를 조회하지 않은 채 원래 photo null 결과를 반환하므로 DeleteConflict에는 WISH_PHOTO_EXPIRED가 없습니다. redaction이 실패하면 삭제와 사진 revocation도 rollback합니다. tombstone과 불변 이력에는 사진 identity나 URL을 남기지 않습니다. 응답 capability 발급은 commit 전에 완료합니다. 이후의 모든 조회는 WISH_NOT_FOUND로 숨깁니다. OPEN 잔액 조정 건이 있어도 삭제를 차단하지 않습니다.
         */
        delete: operations["deleteWish"];
        options?: never;
        head?: never;
        /**
         * 변경 가능한 위시 필드를 원자적으로 병합 패치
         * @description 필드를 생략하면 기존 값을 유지하고 startDate 또는 targetDate에 null을 지정하면 해당 날짜를 지웁니다. 두 날짜를 함께 변경할 때는 중간 상태가 아니라 원자적으로 적용한 최종 날짜 쌍을 검증하며, 둘 다 날짜이면 startDate가 targetDate보다 늦지 않아야 합니다. photoId를 생략하면 현재 사진을 유지하고 null이면 제거하며, 현재 사진과 같은 UUID이면 성공 no-op, 다른 UUID이면 새 Pending 사진을 원자적으로 첨부하고 이전 사진을 즉시 접근 불가능한 DELETE_PENDING으로 만듭니다. 교체나 명시적 제거는 이전 사진의 보존 중인 성공 업로드 receipt를 파괴적 정리 전에 REVOKED_SUCCESS로 바꾸고, 새로 첨부한 사진의 ACTIVE_SUCCESS와 retainUntil은 유지합니다. 사진 추가·교체·제거는 IN_PROGRESS 또는 AMOUNT_REACHED에서만 허용하고, terminal 위시에 photoId를 제공하면 보존된 사진과 같은 값이어도 INVALID_STATE_TRANSITION입니다. expectedVersion은 계속 필수이며 stale 음수 아닌 값은 VERSION_CONFLICT입니다. 교체 실패는 기존 attachment와 후보 Pending 사진을 그대로 유지합니다. 성공한 날짜 변경은 updatedAt과 version을 정확히 한 번 갱신합니다. 성공한 사진 변경도 version과 updatedAt, 존재하는 Shared Card의 contentUpdatedAt을 갱신합니다. 역전된 날짜 범위는 어떤 필드, version, updatedAt 또는 공유 카드도 변경하지 않습니다. 잔액 불일치가 없을 때 COMPLETED 또는 ABANDONED 위시는 공개 범위만 변경할 수 있습니다. 위시를 포기하면 공유 카드를 제거하지만 첨부 사진과 ACTIVE_SUCCESS receipt는 보존합니다. 포기된 위시의 공개 범위를 변경하면 소유자에게 보이는 위시 메타데이터만 갱신하고 공유 카드는 절대 생성하지 않습니다. OPEN 잔액 조정 건이 있으면 purpose, targetAmount, startDate, targetDate를 비롯해 공개 범위를 확대·축소하거나 PRIVATE로 바꾸는 모든 요청 필드를 거부합니다. 응답 capability 발급은 commit 전에 끝나야 합니다.
         */
        patch: operations["patchWish"];
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}/abandonment": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 위시를 포기하고 영구 비공개로 전환
         * @description OPEN 잔액 조정 건이 있어도 포기를 차단하지 않습니다. 첨부 사진은 보존되지만 이후 사진 변경은 허용하지 않습니다. 일치하는 멱등 재생은 최초 포기 snapshot의 NO_PHOTO를 그대로 null로 유지하거나 유효한 ACTIVE_PHOTO의 정확한 photoId에만 새 5분 URL을 발급합니다. 이후 Wish 삭제 등으로 원래 사진이 PHOTO_REVOKED이면 성공 본문 없이 409 WISH_PHOTO_EXPIRED이고, URL 발급만 실패하면 503 PHOTO_DELIVERY_UNAVAILABLE입니다. 반환된 위시는 변경 커밋 후의 잔액 조정 플래그를 담고 응답 capability는 commit 전에 발급합니다.
         */
        post: operations["abandonWish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}/completion": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 목표 금액에 도달한 위시 완료
         * @description OPEN 잔액 조정 건이 있어도 완료를 차단하지 않습니다. 첨부 사진은 보존되지만 이후 사진 변경은 허용하지 않습니다. 일치하는 멱등 재생은 최초 완료 snapshot의 NO_PHOTO를 그대로 null로 유지하거나 유효한 ACTIVE_PHOTO의 정확한 photoId에만 새 5분 URL을 발급합니다. 이후 Wish 삭제 등으로 원래 사진이 PHOTO_REVOKED이면 성공 본문 없이 409 WISH_PHOTO_EXPIRED이고, URL 발급만 실패하면 503 PHOTO_DELIVERY_UNAVAILABLE입니다. 반환된 위시는 변경 커밋 후의 잔액 조정 플래그를 담고 응답 capability는 commit 전에 발급합니다.
         */
        post: operations["completeWish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}/deposits": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 카드 잔액 계정 자금을 위시에 적립
         * @description 내부에서 PRE_DEPOSIT 조회를 수행합니다. 외부 제공자 조회가 실패하면 위시는 변경되지 않습니다. 저장된 불일치 관측 결과는 이 입금 작업만 잠그고 거부합니다. 일치하는 멱등 재생은 최초 Wish snapshot의 NO_PHOTO를 그대로 null로 유지하거나, 유효한 ACTIVE_PHOTO의 정확한 photoId에만 새 5분 URL을 발급합니다. 원래 사진이 PHOTO_REVOKED이면 성공 본문 없이 409 WISH_PHOTO_EXPIRED이고, URL 발급만 실패하면 503 PHOTO_DELIVERY_UNAVAILABLE입니다.
         */
        post: operations["depositToWish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}/fund-movements": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        /**
         * 위시 단위 불변 자금 이동 이력 조회
         * @description 요청한 소유 위시에 대한 불변 원장 위시 효과만 반환하며 외부 카드 잔액 변경은 포함하지 않습니다. 일반 위시 상세 조회가 404를 반환하더라도 소유자가 논리 삭제한 위시는 이 이력에서 조회할 수 있습니다. 결과는 occurredAt DESC, eventId DESC 순으로 정렬합니다. 불투명 커서는 이 작업, 계정, 위시, 정렬 버전, 마지막 튜플에 바인딩됩니다. 형식이 잘못되었거나 바인딩이 일치하지 않는 커서는 부분 페이지 없이 400을 반환합니다. 다음 페이지는 마지막 튜플보다 엄격히 뒤에 이어지며, eventId가 같은 타임스탬프의 순서를 안정화하므로 경계 앞에 정렬되는 새 이벤트가 생겨도 연속 지점은 바뀌지 않습니다. 유효한 커서에는 유효한 limit 값을 함께 사용할 수 있습니다. 권한과 소유권은 요청할 때마다 다시 평가하며 캐시 가능성을 보장하지 않습니다.
         */
        get: operations["listWishFundMovements"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}/withdrawals": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 위시에서 자금 인출
         * @description 일치하는 멱등 재생은 최초 Wish snapshot의 identity·상태·version·event identity를 유지합니다. NO_PHOTO는 이후 현재 attachment가 있어도 null이고, ACTIVE_PHOTO는 캡처된 정확한 photoId가 같은 소유자와 위시에 유효하게 ATTACHED인 경우에만 새 5분 URL로 성공합니다. PHOTO_REVOKED이면 성공 본문 없이 409 WISH_PHOTO_EXPIRED이고, 유효한 사진의 URL 발급만 실패하면 503 PHOTO_DELIVERY_UNAVAILABLE입니다.
         */
        post: operations["withdrawFromWish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/me/card-balance-accounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 인증된 학생의 카드 잔액 계정 목록 조회
         * @description UNKNOWN 잔액은 임의로 0을 만들지 않고 null로 유지합니다. 각 계정은 계정 범위의 잔액 조정 건(Balance Adjustment Case)이 현재 OPEN인지도 함께 표시합니다.
         */
        get: operations["listMyCardBalanceAccounts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/me/student-blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 인증된 학생이 설정한 활성 차단 목록 조회
         * @description 차단 주체가 현재 인증 주체의 subjectId인 활성 단방향 차단만 반환합니다. 결과는 blockedAt DESC, studentId DESC 순으로 정렬합니다. 불투명 커서는 이 작업, 인증된 학생, 정렬 버전, 마지막 튜플에 바인딩됩니다. 형식이 잘못되었거나 바인딩이 일치하지 않는 커서는 부분 페이지 없이 400을 반환합니다. 다음 페이지는 마지막 튜플보다 엄격히 뒤에 이어지며 유효한 커서에는 유효한 limit 값을 함께 사용할 수 있습니다.
         */
        get: operations["listMyStudentBlocks"];
        put?: never;
        /**
         * 학생을 전체 범위에서 차단
         * @description 인증 주체에서만 차단 주체를 가져와 전역 단방향 차단을 활성화합니다. 같은 학원 소속을 요구하지 않으며 기존 상대방의 역방향 차단도 자신의 차단 생성을 금지하지 않습니다. 같은 트랜잭션에서 모든 학원의 양방향 현재 팔로우를 종료합니다. 이미 활성인 자기 소유 차단은 409 STUDENT_BLOCK_ALREADY_ACTIVE, 자신은 409 SELF_RELATIONSHIP입니다. 영구 Idempotency-Key나 expectedVersion은 받지 않습니다. 팔로우·언팔로우의 중복 성공은 과거 결과 재생이 아닌 현재 상태의 no-op입니다. 겹치는 유효 요청은 서버 직렬화 순서대로 처리하며 마지막 유효 요청이 현재 상태를 결정합니다. 언팔로우 뒤 지연된 팔로우 재시도는 새 관계를 만들 수 있습니다. 같은 상대방에 대한 클라이언트 변경 요청은 순차 실행해야 하며 기기 간 순서는 서버 처리 순서만 보장합니다. 팔로우·언팔로우·차단·차단 해제는 전역 학생 쌍 단위로 일관되게 직렬화하고 관계 변경과 같은 트랜잭션에서 양방향 차단을 재검증합니다.
         */
        post: operations["blockStudent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/me/student-blocks/{studentId}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 관계 상대방의 UUID입니다. 인증된 소유자 정보는 항상 현재 인증 주체에서 가져오며 이 매개변수로 받지 않습니다. */
                studentId: components["parameters"]["StudentId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * 단방향 학생 차단 해제
         * @description 인증된 학생이 소유한 현재 차단만 해제합니다. 부재·비활성·비소유 차단은 404 STUDENT_BLOCK_NOT_FOUND입니다. 팔로우는 절대 복원하지 않으며 독립적인 역방향 활성 차단은 계속 적용됩니다. 성공 응답 본문은 없습니다. 전역 학생 쌍 직렬화를 관계 변경과 공유합니다.
         */
        delete: operations["unblockStudent"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/wish-photos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 위시에 첨부할 비공개 사진 업로드
         * @description 인증된 학생 소유의 Pending 사진을 동기적으로 만듭니다. 정확히 하나의 photo 파트만 허용하고 5 MiB보다 큰 바이트 스트림은 디코딩 전에 중단합니다. 실제 JPEG 1080x1080 이미지만 디코딩한 뒤 EXIF·위치 메타데이터를 제거하고 1080x1080, 720x720, 360x360 JPEG로 재인코딩합니다. adult, racy, violence가 LIKELY 또는 VERY_LIKELY이면 PHOTO_CONTENT_NOT_ALLOWED로 거부하지만 medical 또는 spoof가 POSSIBLE인 것만으로는 거부하지 않습니다. 요청 지문은 multipart framing·boundary·filename을 제외한, 변환 전 수신 photo 파트 정확한 바이트의 SHA-256입니다. 소유자와 Idempotency-Key로 범위가 정해진 최소 receipt는 최초 receipt 생성 업로드가 시작된 시점부터 정확히 24시간 동안만 효력이 있습니다. 보존 중인 같은 지문의 ACTIVE_SUCCESS는 변환·검사·저장·quota 소비를 반복하지 않고 같은 photoId와 새 5분 signed URL을 201로 재생합니다. 새 URL 발급만 실패하면 receipt를 바꾸지 않고 503 PHOTO_DELIVERY_UNAVAILABLE을 반환합니다. 같은 지문의 REVOKED_SUCCESS 또는 이미 재생할 수 없는 사진은 사진·URL·receipt 세부 정보 없이 409 WISH_PHOTO_EXPIRED를 반환하고, 다른 지문은 처리 전에 409 IDEMPOTENCY_KEY_REUSED를 반환합니다. 보존한 결정적 거부는 원래 status와 안정적 code를 재생하되 자유 형식 message는 보존하지 않습니다. request time이 retainUntil에 도달하면 이전 receipt는 논리적으로 없으며 같은 key를 새 업로드에 재사용할 수 있습니다. 첨부 자체와 완료·포기는 성공 receipt를 폐기하지 않지만 Pending 취소·만료, 교체·명시적 제거, Wish 삭제, DELETE_PENDING 전환, hard cleanup은 파괴적 정리 전에 REVOKED_SUCCESS로 바꾸고 retainUntil까지 receipt를 남깁니다. 학생별 미첨부 Pending 사진은 최대 3개이고 rolling 1시간의 새 처리 시도는 최대 20회입니다. 파일 이름은 신뢰하지 않고 업로더 identity는 인증 주체에서만 결정합니다.
         */
        post: operations["uploadWishPhoto"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/wish-photos/{photoId}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Opaque 위시 사진 UUID입니다. 식별자 knowledge만으로 읽기, 취소 또는 첨부 권한이 생기지 않습니다. */
                photoId: components["parameters"]["WishPhotoId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * 미첨부 Pending 위시 사진 취소
         * @description 인증된 소유자만 미첨부 Pending 사진을 취소할 수 있습니다. 소유한 PENDING 또는 만료 사진은 즉시 첨부 불가능한 DELETE_PENDING으로 바꾸고 204를 반환하며 객체 제거와 hard delete는 비동기로 이어집니다. 성공한 취소는 정리를 enqueue하기 전에 보존 중인 성공 업로드 receipt를 REVOKED_SUCCESS로 바꾸고 retainUntil까지 남깁니다. 같은 소유자가 DELETE_PENDING 상태에서 반복하면 204 no-op입니다. 없거나 다른 학생 소유인 식별자는 404 WISH_PHOTO_NOT_FOUND로 숨기고, 위시에 이미 첨부된 사진은 409 WISH_PHOTO_ALREADY_ATTACHED를 반환합니다. photoId나 기존 signed URL 자체는 권한을 부여하지 않습니다.
         */
        delete: operations["deletePendingWishPhoto"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AbandonmentSharedCard: {
            /** @description 임시 정렬에 사용하는 포기 카드 게시 또는 콘텐츠 변경의 RFC 3339 UTC Z 시점입니다. 공개된 진행 카드가 포기로 교체될 때 한 번 갱신되며 멱등 재생이나 조회 시점 권한 검사는 이 값을 바꾸지 않습니다. */
            contentUpdatedAt: components["schemas"]["UtcInstant"];
            /**
             * @description 포기 결과를 게시한 공유 카드임을 식별하는 ABANDONMENT 판별자입니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            kind: "ABANDONMENT";
            /** @description 작성 학생의 안정적인 UUID입니다. 학생 조회의 studentId와 같으며 sharedCardId 및 비공개 wishId와 구별됩니다. 닉네임 변경이나 완료 카드 교체 또는 포기 카드 교체 후에도 유지됩니다. */
            ownerId: components["schemas"]["Uuid"];
            /** @description 소유자의 현재 표시 닉네임이며 식별 키가 아닙니다. 작성자 식별은 ownerId를 사용하며 실명, 별도 studentId 속성, 계정 데이터 또는 실제 카드 데이터는 노출하지 않습니다. */
            ownerNickname: string;
            /** @description 현재 권한 검사 뒤 발급된 5분 비공개 사진 URL 세트이며 첨부 사진이 없으면 null입니다. 사진 식별자, object key, 과거 signed URL은 노출하지 않습니다. */
            photo: components["schemas"]["WishPhoto"] | null;
            /** @description 포기 직전에 불변으로 캡처한 적립액과 targetAmount에서 floor(abandonmentAmount * 100 / targetAmount)로 한 번 계산한 정수입니다. 캡처 금액이 0이면 0이며 null이나 생략으로 바꾸지 않습니다. 100은 캡처 금액이 targetAmount와 같을 때만 반환합니다. 정확한 KRW 금액과 현재 배정 금액은 노출하지 않습니다. */
            progressPercent: number;
            /** @description 게시된 NFC 정규화 위시 목적입니다. */
            purpose: components["schemas"]["Purpose"];
            /** @description 개인정보를 노출하지 않는 이 공유 카드 프로젝션의 안정적인 UUID입니다. 기반 위시 또는 계정 식별자는 노출하지 않습니다. */
            sharedCardId: components["schemas"]["Uuid"];
            /**
             * Format: date
             * @description 저장된 위시 시작 달력 날짜 LocalDate를 YYYY-MM-DD 또는 null로 직접 투영합니다. 필드는 항상 존재하며 미지정은 null입니다. 생성 시각이나 오늘 날짜로 보충하거나 시간대를 변환하지 않습니다.
             */
            startDate: string | null;
            /**
             * @description 이 포기 공유 카드의 고정된 위시 상태 ABANDONED입니다.
             * @constant
             */
            state: "ABANDONED";
            /** @description 게시된 양의 정수 KRW 목표 금액입니다. 포기 직전 적립액이나 포기 뒤 현재 0원 배정은 노출하지 않습니다. */
            targetAmount: components["schemas"]["KrwPositive"];
            /**
             * Format: date
             * @description 저장된 위시 목표 달력 날짜 LocalDate를 YYYY-MM-DD 또는 null로 직접 투영합니다. 필드는 항상 존재하며 미지정은 null입니다. 생성 시각이나 오늘 날짜로 보충하거나 시간대를 변환하지 않습니다.
             */
            targetDate: string | null;
        };
        AccountCardBalanceChange: {
            /** @description 이벤트 직후 부호 있는 원장 기준 가용 계정 잔액 음수 값은 유지되며 표시가 고정되지 않습니다. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description 부호 있는 원장 기준 가용 계정 잔액 변경은 actualCardBalanceDelta와 정확히 동일합니다. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"];
            /** @description 이 외부 변경 후에 관측된 음수가 아닌 정수 KRW입니다. */
            actualCardBalanceAfter: components["schemas"]["KrwNonNegative"];
            /** @description 0이 아닌 부호 있는 정수 KRW 외부 카드 잔액 변경. */
            actualCardBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다. 이전 이벤트는 변경되지 않습니다.
             */
            correctionOfEventId: string | null;
            /** @description 이 불변의 CARD_BALANCE_CHANGE 이벤트의 UUID; 해당 CardBalanceChange eventId와 동일합니다. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 CARD_BALANCE_CHANGE, 0이 아닌 성공적인 외부 카드 잔액 변경을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "CARD_BALANCE_CHANGE";
            /** @description 연결된 관측에 대한 트리거: USER_REQUESTED, PRE_DEPOSIT 또는 AUTO_DAILY. */
            lookupMethod: components["schemas"]["BalanceLookupMethod"];
            /** @description 이 이벤트와 연결된 정확한 성공적인 잔액 관측의 UUID입니다. */
            observationId: components["schemas"]["Uuid"];
            /** @description RFC 3339 UTC Z 시점는 연결된 관측의 observedAt 값과 같습니다. */
            occurredAt: components["schemas"]["UtcInstant"];
        };
        AccountFundMovement: components["schemas"]["AccountCardBalanceChange"] | components["schemas"]["AccountWishDeposit"] | components["schemas"]["AccountWishWithdrawal"] | components["schemas"]["AccountWishTransfer"] | components["schemas"]["AccountWishCompletionReturn"] | components["schemas"]["AccountWishAbandonmentReturn"] | components["schemas"]["AccountWishDeletionReturn"];
        AccountFundMovementPage: {
            /** @description 외부 카드 변경 및 모든 위시 이동을 포함하여 occurredAt 내림차순, eventId 내림차순의 불변 원장 이벤트당 하나의 항목입니다. */
            items: components["schemas"]["AccountFundMovement"][];
            /** @description 다른 항목이 존재할 때 최종 반환된 (occurredAt, eventId) 튜플에서 파생된 불투명 커서입니다. 빈 페이지와 종결 상태 페이지의 경우 null입니다. */
            nextCursor: string | null;
        };
        AccountWishAbandonmentReturn: {
            /** @description 포기 반환 직후 부호 있는 원장 기준 가용 계정 잔액입니다. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description 포기된 위시에서 반환된 양의 정수 KRW입니다. 반환액이 0이면 이벤트나 이력 항목을 만들지 않습니다. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 포기된 위시의 이동 프로젝션과 공유된 불변 원장 이벤트의 UUID. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_ABANDONMENT_RETURN, 포기 중에 반환된 0이 아닌 자금을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_ABANDONMENT_RETURN";
            /** @description 포기 과정에서 남은 위시 자금을 반환한 RFC 3339 UTC Z 시점입니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 포기된 위시에 대한 이벤트 시점 목적 및 조회 시점 논리 삭제 맥락입니다. */
            wish: components["schemas"]["WishHistoryReference"];
        };
        AccountWishCompletionReturn: {
            /** @description 완료 반환 후 즉시 부호 있는 원장 기준 가용 계정 잔액입니다. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description 완료된 위시에서 반환된 양의 정수 KRW입니다. 반환액이 0이면 이벤트나 이력 항목을 만들지 않습니다. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 완료된 위시의 이동 프로젝션과 공유되는 불변 원장 이벤트의 UUID. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_COMPLETION_RETURN, 명시적 완료 중에 반환된 0이 아닌 자금을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_COMPLETION_RETURN";
            /** @description RFC 3339 UTC Z 완료 시점에 나머지 위시 자금이 반환되었습니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 완료된 위시에 대한 이벤트 시점 목적 및 조회 시점 논리 삭제 맥락입니다. */
            wish: components["schemas"]["WishHistoryReference"];
        };
        AccountWishDeletionReturn: {
            /** @description 삭제 반환 후 즉시 부호 있는 원장 기준 가용 계정 잔액입니다. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description 삭제된 위시에서 반환된 양의 정수 KRW입니다. 반환액이 0이면 이벤트나 이력 항목을 만들지 않습니다. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 논리 삭제가 있는 위시의 이동 프로젝션과 공유되는 불변 원장 이벤트의 UUID입니다. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_DELETION_RETURN, 논리 삭제 중에 반환된 0이 아닌 자금을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_DELETION_RETURN";
            /** @description 논리 삭제 과정에서 남은 위시 자금을 반환한 RFC 3339 UTC Z 시점입니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 삭제된 위시에 대한 삭제 시점 목적 및 조회 시점 논리 삭제 맥락입니다. */
            wish: components["schemas"]["WishHistoryReference"];
        };
        AccountWishDeposit: {
            /** @description 입금 후 즉시 부호 있는 원장 기준 가용 계정 잔액입니다. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description 이번 입금으로 인해 음수 KRW 원장 기준 가용 계정 잔액이 변경되었습니다. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 불변 원장 이벤트의 UUID는 해당 위시 입금 프로젝션과 공유됩니다. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_DEPOSIT, 계정 가용 잔액에서 하나의 위시에 할당된 자금을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_DEPOSIT";
            /** @description 이 불변 입금 이벤트가 발생한 RFC 3339 UTC Z 시점입니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 자금을 받은 위시에 대한 이벤트 시점 목적 및 조회 시점 논리 삭제 맥락입니다. */
            wish: components["schemas"]["WishHistoryReference"];
        };
        AccountWishTransfer: {
            /** @description 이체 후 부호 있는 원장 기준 가용 계정 잔액은 이체 자체에 의해 변경되지 않습니다. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /**
             * @description 동일한 계정의 위시 이체는 계정 단위의 가용성을 변경하지 않으므로 항상 0입니다.
             * @constant
             */
            accountAvailableBalanceDelta: 0;
            /** @description 양의 정수 KRW가 sourceWish에서 destinationWish로 원자적으로 이동되었습니다. */
            amount: components["schemas"]["KrwPositive"];
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 서로 다른 도착 위시에 대한 이벤트 시점 목적 및 조회 시점 논리 삭제 맥락입니다. */
            destinationWish: components["schemas"]["WishHistoryReference"];
            /** @description 부호가 반대인 두 위시 이체 프로젝션이 공유하는 하나의 불변 원장 이벤트 UUID입니다. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_TRANSFER, 동일한 계정에 있는 두 개의 서로 다른 위시 사이의 원자적 전송을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_TRANSFER";
            /** @description RFC 3339 UTC Z 이체의 두 불변 위시 효과에 의해 즉시 공유됩니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 서로 다른 출발 위시에 대한 이벤트 시점 목적 및 조회 시점 논리 삭제 맥락입니다. */
            sourceWish: components["schemas"]["WishHistoryReference"];
        };
        AccountWishWithdrawal: {
            /** @description 출금 후 즉시 부호 있는 원장 기준 가용 계정 잔액입니다. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description 이번 출금으로 인해 양수 KRW 원장 기준 가용 계정 잔액이 변경되었습니다. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 해당 위시 출금 프로젝션과 공유되는 불변 원장 이벤트의 UUID. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_WITHDRAWAL, 하나의 위시에서 계정 가용 잔액으로 반환된 자금을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_WITHDRAWAL";
            /** @description 이 불변 출금 이벤트가 발생한 RFC 3339 UTC Z 시점입니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 자금이 인출된 위시에 대한 이벤트 시점 목적 및 조회 시점 논리 삭제 맥락입니다. */
            wish: components["schemas"]["WishHistoryReference"];
        };
        /** @description 원장 이벤트와 잔액 조정 건을 연결하는 불변 출처 정보이며 잔액 조정 건의 변경 가능한 현재 상태가 아닙니다. 관측에만 존재하는 최초 성공 불일치 사실은 이력 항목을 만들지 않습니다. 부족액, 알림 상태, 관련 없는 관측 데이터는 여기서 노출하지 않습니다. */
        BalanceAdjustmentEventReference: {
            /** @description 이 불변 원장 이벤트에 연결된 잔액 조정 건의 UUID입니다. */
            adjustmentCaseId: components["schemas"]["Uuid"];
            /**
             * @description 잔액 조정 건 내에서 이 이벤트의 불변 역할: 개시 감소, 중간 보상 또는 해결.
             * @enum {string}
             */
            eventRole: "OPENING_DECREASE" | "INTERMEDIATE" | "RESOLUTION";
            /** @description 잔액 조정 건 내부에서 이 이벤트 링크의 0 기반 불변 순서입니다. */
            sequenceNumber: number;
        };
        /**
         * @description 내부 계정 조정 상태 어휘는 소유자 오류 세부 정보에만 사용되며 공유 카드 프로젝션에는 사용되지 않습니다.
         * @enum {string}
         */
        BalanceAdjustmentStatus: "OPEN" | "RESOLVED";
        /** @enum {string} */
        BalanceLookupMethod: "USER_REQUESTED" | "PRE_DEPOSIT" | "AUTO_DAILY";
        BalanceRefreshResult: {
            /** @description 이 성공 관측에서 파생한 갱신된 KNOWN 카드 잔액 계정 스냅샷입니다. */
            account: components["schemas"]["KnownCardBalanceAccount"];
            /**
             * @description 이 공개 본문 없는 작업은 사용자가 요청한 조회를 수행하고 클라이언트가 선택한 방법을 허용하지 않으므로 항상 USER_REQUESTED입니다.
             * @constant
             */
            lookupMethod: "USER_REQUESTED";
            /** @description 새로 저장된 성공 잔액 관측의 UUID입니다. */
            observationId: components["schemas"]["Uuid"];
            /** @description 이 외부 잔액 조회를 시도한 RFC 3339 UTC Z 시점입니다. */
            observedAt: components["schemas"]["UtcInstant"];
        };
        /** @description 방향성 작성자 관심만 나타내며 카테고리 관심이나 클릭을 방문으로 대체하지 않습니다. */
        BehaviorAuthorInterestDaily: {
            /**
             * @description 해당 기간의 수집 및 논리 보존 범위입니다.
             * @enum {string}
             */
            coverageStatus: "COMPLETE" | "PARTIAL" | "NONE";
            /** @description 서울 기준 날짜이며 요청한 모든 날짜를 오름차순으로 반환합니다. */
            date: components["schemas"]["UtcDate"];
            /**
             * Format: int64
             * @description 본인에서 특정 작성자로 향한 날짜별 방문 수이며 NONE이면 null입니다.
             */
            profileVisitCount: number | null;
        } & unknown;
        /** @description 양쪽 현재 학원 소속과 양방향 차단 부재가 필요하며 작성자 관심만 제공합니다. */
        BehaviorAuthorInterestMetrics: {
            /** @description 조회 대상 학원 UUID입니다. */
            academyId: components["schemas"]["Uuid"];
            /** @description 발생 시각 상한과 보존 판정에 쓰는 한 번의 일관된 조회 시각입니다. */
            asOf: components["schemas"]["UtcInstant"];
            /** @description 관심 대상 작성자의 학생 UUID입니다. */
            authorStudentId: components["schemas"]["Uuid"];
            /** @description 수집 가능성과 논리 보존 상태를 수치와 함께 해석합니다. */
            coverage: components["schemas"]["BehaviorMetricCoverage"];
            /** @description 요청한 모든 날짜의 오름차순 작성자 방문 지표입니다. */
            daily: components["schemas"]["BehaviorAuthorInterestDaily"][];
            /** @description 조회한 서울 날짜 반개구간입니다. */
            period: components["schemas"]["BehaviorMetricPeriod"];
            /**
             * Format: int64
             * @description studentId에서 authorStudentId로 향한 방문 수이며 NONE이면 null입니다.
             */
            profileVisitCount: number | null;
            /**
             * @description 내부 지표 계약 버전입니다.
             * @constant
             */
            schemaVersion: 1;
            /** @description 관심을 보낸 현재 학원 학생 UUID입니다. */
            studentId: components["schemas"]["Uuid"];
        } & unknown;
        /** @description 새 이벤트는 201, 현재 접근을 확인한 동일 이벤트 재생은 200으로 같은 본문을 반환합니다. */
        BehaviorEventAccepted: {
            /** @description 최초 수락한 이벤트 UUID입니다. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 수락한 행동 유형입니다.
             * @enum {string}
             */
            eventType: "PROFILE_VISIT" | "FEED_EXPOSURE" | "FEED_CLICK";
            /** @description 마이크로초로 절삭한 최초 발생 시각이며 재생에도 그대로 유지합니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 최초 수신 시각이며 재생에도 그대로 유지합니다. */
            receivedAt: components["schemas"]["UtcInstant"];
        };
        /** @description 노출보다 먼저 또는 노출 없이 발생한 클릭도 수락하며 노출을 합성하지 않습니다. */
        BehaviorFeedClickRequest: {
            /** @description 해당 맥락에 실제 기록된 카드 UUID입니다. */
            cardId: components["schemas"]["Uuid"];
            /**
             * @description 기존 방문하기 동작입니다. 도착 프로필의 방문 기록은 별도 이벤트입니다.
             * @constant
             */
            clickKind: "AUTHOR_PROFILE";
            /** @description 인증 학생별 이벤트 UUID입니다. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 피드 클릭 이벤트입니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "FEED_CLICK";
            /** @description 학생 범위에서 맥락·카드·위치에 불변 결속되는 가시성 주기 UUID입니다. */
            impressionId: components["schemas"]["Uuid"];
            /** @description 실제 행동 시각이며 마이크로초 아래 정밀도는 절삭합니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 결과 페이지 안의 0부터 시작하는 카드 위치입니다. */
            position: number;
            /** @description 본인과 현재 학원에 속한 결과 맥락 UUID입니다. */
            resultContextId: components["schemas"]["Uuid"];
        };
        /** @description eventType에 맞는 닫힌 요청 하나만 허용하며 알 수 없는 필드와 null을 거부합니다. */
        BehaviorFeedEventRequest: components["schemas"]["BehaviorFeedExposureRequest"] | components["schemas"]["BehaviorFeedClickRequest"];
        /** @description 문서가 보이는 동안 카드가 50% 이상 연속 1000ms 보인 주기당 하나의 노출입니다. clickKind는 금지됩니다. */
        BehaviorFeedExposureRequest: {
            /** @description 해당 맥락에 실제 기록된 카드 UUID입니다. */
            cardId: components["schemas"]["Uuid"];
            /** @description 인증 학생별 이벤트 UUID입니다. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 피드 노출 이벤트입니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "FEED_EXPOSURE";
            /** @description 학생 범위에서 맥락·카드·위치에 불변 결속되는 가시성 주기 UUID입니다. */
            impressionId: components["schemas"]["Uuid"];
            /** @description 실제 행동 시각이며 마이크로초 아래 정밀도는 절삭합니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 결과 페이지 안의 0부터 시작하는 카드 위치입니다. */
            position: number;
            /** @description 본인과 현재 학원에 속한 결과 맥락 UUID입니다. */
            resultContextId: components["schemas"]["Uuid"];
        };
        /** @description actor/impression과 불변 맥락·카드·위치로 결합합니다. 여러 클릭은 클릭 수만 늘리고 CTR 분자는 한 번만 늘립니다. */
        BehaviorFeedMetricItem: {
            /**
             * Format: int64
             * @description 유효한 AUTHOR_PROFILE 클릭 이벤트 수입니다.
             */
            clickCount: number;
            /**
             * Format: int64
             * @description 기간 내 유효한 노출과 하나 이상 클릭이 함께 있는 고유 actor/impression 수입니다.
             */
            clickedExposedImpressionCount: number;
            /** @description 노출이 0이면 null, 아니면 clickedExposedImpressionCount / exposureCount입니다. */
            ctr: number | null;
            /**
             * Format: int64
             * @description 유효한 고유 actor/impression 노출 수입니다.
             */
            exposureCount: number;
            /** @description 결과 페이지 안의 0부터 시작하는 카드 위치입니다. */
            position: number;
            /**
             * @description 서버가 기록한 정렬 출처입니다.
             * @constant
             */
            sortSource: "LATEST";
            /**
             * Format: int64
             * @description 요청 기간 안의 유효한 대응 노출이 없는 클릭 이벤트 수입니다.
             */
            unmatchedClickCount: number;
        } & unknown;
        /** @description 각 이벤트의 현재 카드 가시성과 발생 시각, 수신 보존을 독립적으로 검사한 피드 지표입니다. */
        BehaviorFeedMetrics: {
            /** @description 조회 대상 학원 UUID입니다. */
            academyId: components["schemas"]["Uuid"];
            /** @description 발생 시각 상한과 보존 판정에 쓰는 한 번의 일관된 조회 시각입니다. */
            asOf: components["schemas"]["UtcInstant"];
            /** @description 수집 가능성과 논리 보존 상태를 수치와 함께 해석합니다. */
            coverage: components["schemas"]["BehaviorMetricCoverage"];
            /** @description 관측된 유효 활동이 있는 행만 sortSource, position 오름차순으로 반환합니다. NONE이면 빈 배열입니다. */
            items: components["schemas"]["BehaviorFeedMetricItem"][];
            /** @description 조회한 서울 날짜 반개구간입니다. */
            period: components["schemas"]["BehaviorMetricPeriod"];
            /**
             * @description 내부 지표 계약 버전입니다.
             * @constant
             */
            schemaVersion: 1;
        } & unknown;
        /** @description COMPLETE도 모든 클라이언트 활동 전달을 보장하지 않습니다. NONE은 알려진 범위와 겹치지 않고 기여 이벤트도 없는 경우입니다. 일부 보존 이벤트가 있으면 PARTIAL로 계산합니다. */
        BehaviorMetricCoverage: {
            /** @description 조회 전체에 일관되게 적용하는 asOf입니다. */
            availableThrough: components["schemas"]["UtcInstant"];
            /** @description 최초 이벤트가 아닌 영속적인 백엔드 수집 활성화 시각이며 재시작으로 초기화하지 않습니다. */
            collectionStartedAt: components["schemas"]["UtcInstant"];
            /**
             * @description 기록되었고 현재 접근 가능한 이벤트만 셉니다. 실제 미수집 활동이 0임을 주장하지 않습니다.
             * @constant
             */
            countsMeaning: "RECORDED_ELIGIBLE_EVENTS_ONLY";
            /** @description collectionStartedAt과 retentionCutoffReceivedAt에 5분을 더한 시각 중 최댓값입니다. */
            fullyRetainedFrom: components["schemas"]["UtcInstant"];
            /** @description 수집 이전·보존 만료·진행 중 기간의 적용 사유입니다. */
            reasons: ("BEFORE_COLLECTION" | "RETENTION_EXPIRED" | "OPEN_PERIOD")[];
            /** @description 일관된 asOf에서 90일을 뺀 값입니다. 이 시각 이하에 수신한 이벤트는 제외합니다. */
            retentionCutoffReceivedAt: components["schemas"]["UtcInstant"];
            /**
             * @description 해당 기간의 수집 및 논리 보존 범위입니다.
             * @enum {string}
             */
            status: "COMPLETE" | "PARTIAL" | "NONE";
        };
        /** @description 양의 기간이며 최대 90일, 종료일은 서울 기준 내일을 넘지 않습니다. */
        BehaviorMetricPeriod: {
            /** @description 서울 기준 포함 시작일입니다. */
            fromDate: components["schemas"]["UtcDate"];
            /** @description 시작일 서울 자정에 해당하는 UTC 시각입니다. */
            fromInclusive: components["schemas"]["UtcInstant"];
            /**
             * @description 날짜 경계에 적용하는 시간대입니다.
             * @constant
             */
            timezone: "Asia/Seoul";
            /** @description 서울 기준 제외 종료일입니다. */
            toDate: components["schemas"]["UtcDate"];
            /** @description 종료일 서울 자정에 해당하는 UTC 시각입니다. */
            toExclusive: components["schemas"]["UtcInstant"];
        };
        /** @description 날짜별 수집 범위를 독립적으로 계산한 들어온 프로필 방문 지표입니다. */
        BehaviorProfileVisitDaily: {
            /**
             * @description 해당 기간의 수집 및 논리 보존 범위입니다.
             * @enum {string}
             */
            coverageStatus: "COMPLETE" | "PARTIAL" | "NONE";
            /** @description 서울 기준 날짜이며 요청한 모든 날짜를 오름차순으로 반환합니다. */
            date: components["schemas"]["UtcDate"];
            /**
             * Format: int64
             * @description 해당 날짜의 서로 다른 방문 학생 수이며 NONE이면 null입니다.
             */
            distinctVisitorCount: number | null;
            /**
             * Format: int64
             * @description 해당 날짜의 방문 수이며 NONE이면 null입니다.
             */
            visitCount: number | null;
        } & unknown;
        /** @description 개별 방문자 목록 없이 집계만 제공합니다. 이벤트마다 현재 구성원 상태와 양방향 차단을 재검증합니다. */
        BehaviorProfileVisitMetrics: {
            /** @description 조회 대상 학원 UUID입니다. */
            academyId: components["schemas"]["Uuid"];
            /** @description 발생 시각 상한과 보존 판정에 쓰는 한 번의 일관된 조회 시각입니다. */
            asOf: components["schemas"]["UtcInstant"];
            /** @description 수집 가능성과 논리 보존 상태를 수치와 함께 해석합니다. */
            coverage: components["schemas"]["BehaviorMetricCoverage"];
            /** @description 요청한 모든 날짜의 오름차순 지표입니다. */
            daily: components["schemas"]["BehaviorProfileVisitDaily"][];
            /**
             * Format: int64
             * @description 전체 기간의 서로 다른 방문자 수로 일별 고유 방문자 수를 더한 값이 아닙니다. NONE이면 null입니다.
             */
            distinctVisitorCount: number | null;
            /** @description 조회한 서울 날짜 반개구간입니다. */
            period: components["schemas"]["BehaviorMetricPeriod"];
            /**
             * @description 내부 지표 계약 버전입니다.
             * @constant
             */
            schemaVersion: 1;
            /** @description 들어온 방문을 집계할 현재 학원 학생 UUID입니다. */
            studentId: components["schemas"]["Uuid"];
            /**
             * Format: int64
             * @description 현재 접근이 유효한 방문 이벤트 수입니다. NONE이면 null입니다.
             */
            visitCount: number | null;
        } & unknown;
        /** @description 실제 프로필 경로 진입을 기록합니다. 재렌더링이나 재전송은 새 방문이 아닙니다. */
        BehaviorProfileVisitRequest: {
            /** @description 인증 학생 범위에서 모든 행동 유형에 걸쳐 유일한 이벤트 UUID입니다. */
            eventId: components["schemas"]["Uuid"];
            /** @description 실제 경로 진입 시점입니다. 비교와 저장 전에 마이크로초 아래 자릿수를 버립니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 같은 학원의 방문 대상 학생 UUID입니다. */
            targetStudentId: components["schemas"]["Uuid"];
        };
        CardBalanceAccount: components["schemas"]["UnknownCardBalanceAccount"] | components["schemas"]["KnownCardBalanceAccount"];
        CardBalanceAccountPage: {
            /** @description 이 페이지에서 인증된 학생이 볼 수 있는 카드 잔액 계정입니다. */
            items: components["schemas"]["CardBalanceAccount"][];
            /** @description 다음 계정 페이지에 대한 불투명 커서. 추가 페이지가 없으면 null입니다. */
            nextCursor: string | null;
        };
        CardBalanceChange: {
            /** @description 이 성공적인 조회로 관측된 음수가 아닌 정수 KRW입니다. */
            actualCardBalanceAfter: components["schemas"]["KrwNonNegative"];
            /** @description 이전에 성공적으로 관측한 잔액을 기준으로 한 0 아닌 부호 있는 정수 KRW 변동액입니다. 첫 성공 관측은 0을 기준으로 계산합니다. */
            actualCardBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 이 원장 이벤트와 잔액 조정 건을 연결하는 불변 출처 정보입니다. 이벤트가 잔액 조정 건에 연결되지 않았으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 동일 계정의 이전 불변 이벤트 UUID입니다. 보정 이벤트가 아니면 null이며 이전 이벤트 자체는 바꾸지 않습니다.
             */
            correctionOfEventId: string | null;
            /** @description 불변 CARD_BALANCE_CHANGE 원장 이벤트의 UUID입니다. 계정 자금 이동 이력에서도 같은 값으로 이 사실을 식별합니다. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 실패한 관측과 성공했지만 변동액이 0인 관측은 금액 이력 이벤트를 만들지 않으므로 항상 CARD_BALANCE_CHANGE입니다.
             * @constant
             */
            eventType: "CARD_BALANCE_CHANGE";
            /** @description 이 조회에 대한 트리거: USER_REQUESTED, PRE_DEPOSIT 또는 AUTO_DAILY. */
            lookupMethod: components["schemas"]["BalanceLookupMethod"];
            /** @description 이 불변 이벤트에 정확히 연결된 성공 외부 잔액 관측의 UUID입니다. */
            observationId: components["schemas"]["Uuid"];
            /** @description 연결된 성공 관측의 observedAt과 같은 RFC 3339 UTC Z 시점입니다. */
            occurredAt: components["schemas"]["UtcInstant"];
        };
        CardBalanceChangePage: {
            /** @description 변동액이 0 아닌 불변 CARD_BALANCE_CHANGE 이벤트를 occurredAt DESC, eventId DESC 순으로 반환합니다. 실패한 관측과 변동액이 0인 관측은 제외합니다. */
            items: components["schemas"]["CardBalanceChange"][];
            /** @description 다른 항목이 존재할 때 최종 반환된 (occurredAt, eventId) 튜플에서 파생된 불투명 커서입니다. 빈 페이지와 종결 상태 페이지의 경우 null입니다. */
            nextCursor: string | null;
        };
        CompletionSharedCard: {
            /**
             * Format: int64
             * @description max(0, completedAt-createdAt)의 정수 초입니다. 실제 UTC 시각의 차이를 사용하며 startDate 또는 targetDate의 날짜 차이로 재계산하지 않습니다.
             */
            actualDurationSeconds: number;
            /** @description 소유자가 위시를 명시적으로 완료한 RFC 3339 UTC Z 시점입니다. */
            completedAt: components["schemas"]["UtcInstant"];
            /** @description 임시 정렬에 사용하는 가장 최근 콘텐츠 또는 게시 상태 변경의 RFC 3339 UTC Z 시점입니다. */
            contentUpdatedAt: components["schemas"]["UtcInstant"];
            /** @description 기반 위시가 생성된 RFC 3339 UTC Z 시점입니다. */
            createdAt: components["schemas"]["UtcInstant"];
            /**
             * @description 명시적으로 완료되어 게시된 위시 카드를 식별하는 COMPLETION 판별자입니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            kind: "COMPLETION";
            /** @description 작성 학생의 안정적인 UUID입니다. 학생 조회의 studentId와 같으며 sharedCardId 및 비공개 wishId와 구별됩니다. 닉네임 변경이나 완료 카드 교체 후에도 유지됩니다. */
            ownerId: components["schemas"]["Uuid"];
            /** @description 소유자의 현재 표시 닉네임이며 식별 키가 아닙니다. 작성자 식별은 ownerId를 사용합니다. 실명, 별도 studentId 속성, 계정 데이터 또는 실제 카드 데이터는 노출하지 않습니다. */
            ownerNickname: string;
            /** @description 현재 권한 검사 뒤 발급된 5분 비공개 사진 URL 세트이며 첨부 사진이 없으면 null입니다. 완료 이후 사진은 보존되지만 변경할 수 없습니다. */
            photo: components["schemas"]["WishPhoto"] | null;
            /**
             * @description 완료 카드 변형에서는 항상 100입니다.
             * @constant
             */
            progressPercent: 100;
            /** @description 게시된 NFC 정규화 위시 목적입니다. */
            purpose: components["schemas"]["Purpose"];
            /** @description 개인정보를 노출하지 않는 이 공유 카드 프로젝션의 안정적인 UUID입니다. 기반 위시 또는 계정 식별자는 노출하지 않습니다. */
            sharedCardId: components["schemas"]["Uuid"];
            /**
             * Format: date
             * @description 저장된 위시 시작 달력 날짜 LocalDate를 YYYY-MM-DD 또는 null로 직접 투영합니다. 필드는 항상 존재하며 미지정은 null입니다. 생성 시각이나 오늘 날짜로 보충하거나 시간대를 변환하지 않습니다.
             */
            startDate: string | null;
            /** @description 게시된 양의 정수 KRW 목표 금액입니다. 소유자의 정확한 과거 위시 잔액은 노출하지 않습니다. */
            targetAmount: components["schemas"]["KrwPositive"];
            /**
             * Format: date
             * @description 저장된 위시 목표 달력 날짜 LocalDate를 YYYY-MM-DD 또는 null로 직접 투영합니다. 필드는 항상 존재하며 미지정은 null입니다. 생성 시각이나 오늘 날짜로 보충하거나 시간대를 변환하지 않습니다.
             */
            targetDate: string | null;
        };
        /** @description 차단할 학생만 지정하는 요청 페이로드입니다. 차단 주체는 항상 현재 인증 주체의 subjectId에서 가져옵니다. */
        CreateStudentBlockRequest: {
            /** @description 전역적으로 차단할 학생의 UUID입니다. */
            studentId: components["schemas"]["Uuid"];
        };
        CreateWishRequest: {
            /**
             * Format: uuid
             * @description 생략하거나 null이면 사진 없이 생성합니다. UUID이면 인증된 학생 소유의 만료되지 않은 미첨부 Pending 사진을 새 위시에 원자적으로 첨부합니다.
             */
            photoId?: string | null;
            purpose: components["schemas"]["PurposeInput"];
            /**
             * Format: date
             * @description 선택적 계획 시작 달력 날짜입니다. 생략하거나 null이면 null을 저장하며, targetDate와 둘 다 날짜이면 이 값이 더 늦을 수 없습니다.
             */
            startDate?: string | null;
            targetAmount: components["schemas"]["KrwPositive"];
            /** Format: date */
            targetDate?: string | null;
        };
        Cursor: string;
        /** @enum {string} */
        ErrorCode: "SELF_PROFILE_VISIT" | "EVENT_TIME_OUT_OF_RANGE" | "PROFILE_NOT_FOUND" | "FEED_CONTEXT_NOT_FOUND" | "FEED_CONTEXT_EXPIRED" | "EVENT_ID_CONFLICT" | "IMPRESSION_CONFLICT" | "IMPRESSION_ALREADY_EXPOSED" | "MALFORMED_REQUEST" | "EXPECTED_VERSION_REQUIRED" | "IDEMPOTENCY_KEY_REQUIRED" | "AUTH_REQUIRED" | "FORBIDDEN" | "CARD_BALANCE_ACCOUNT_NOT_FOUND" | "WISH_NOT_FOUND" | "ACADEMY_NOT_FOUND" | "SHARED_CARD_NOT_FOUND" | "VERSION_CONFLICT" | "INVALID_STATE_TRANSITION" | "BALANCE_MISMATCH_LOCKED" | "INSUFFICIENT_AVAILABLE_BALANCE" | "INSUFFICIENT_WISH_AMOUNT" | "TARGET_AMOUNT_EXCEEDED" | "CROSS_ACCOUNT_TRANSFER_FORBIDDEN" | "IDEMPOTENCY_KEY_REUSED" | "UNSUPPORTED_MEDIA_TYPE" | "INVALID_AMOUNT" | "INVALID_PURPOSE" | "INVALID_DATE_RANGE" | "INVALID_VERSION" | "BALANCE_SYNC_FAILED" | "RECAP_QUERY_UNAVAILABLE" | "STUDENT_NOT_FOUND" | "STUDENT_BLOCK_NOT_FOUND" | "SELF_RELATIONSHIP" | "STUDENT_BLOCK_ALREADY_ACTIVE" | "WISH_PHOTO_NOT_FOUND" | "WISH_PHOTO_EXPIRED" | "WISH_PHOTO_ALREADY_ATTACHED" | "PHOTO_TOO_LARGE" | "UNSUPPORTED_PHOTO_TYPE" | "INVALID_PHOTO" | "PHOTO_CONTENT_NOT_ALLOWED" | "PHOTO_UPLOAD_RATE_LIMITED" | "PHOTO_PROCESSING_UNAVAILABLE" | "PHOTO_DELIVERY_UNAVAILABLE";
        ErrorEnvelope: {
            /** @description 선언된 모든 실패 JSON 응답이 공통으로 사용하는 구조화된 오류 페이로드입니다. */
            error: {
                /** @description 안정적으로 기계 판독할 수 있는 ErrorCode입니다. 클라이언트는 message 텍스트가 아니라 이 값으로 분기해야 합니다. */
                code: components["schemas"]["ErrorCode"];
                /** @description 오류 코드별로 확장할 수 있는 메타데이터 객체입니다. 적용할 세부 정보가 없으면 비어 있으며 클라이언트는 알 수 없는 키를 무시해야 합니다. 사진 오류에는 raw·transformed bytes, Base64, multipart content, filename, photoId, receipt outcome, retainUntil, signed URL, bucket, object path, content digest, 이미지 메타데이터, traceId 외 사진 내부 정보, 콘텐츠 안전성 category·likelihood 또는 provider payload를 절대 담지 않습니다. WISH_PHOTO_EXPIRED, IDEMPOTENCY_KEY_REUSED, PHOTO_PROCESSING_UNAVAILABLE, PHOTO_DELIVERY_UNAVAILABLE은 빈 details 객체를 반환합니다. */
                details: {
                    [key: string]: unknown;
                };
                /** @description 필드별 유효성 검사 실패 목록입니다. 오류 원인을 개별 요청 필드에 연결할 수 없으면 비어 있습니다. */
                fieldErrors: components["schemas"]["FieldError"][];
                /** @description 이번 오류 발생을 사람이 읽을 수 있게 설명한 문장입니다. 안정적인 기계 판정 키가 아닙니다. */
                message: string;
                /** @description BALANCE_SYNC_FAILED, RECAP_QUERY_UNAVAILABLE, PHOTO_UPLOAD_RATE_LIMITED, PHOTO_PROCESSING_UNAVAILABLE, PHOTO_DELIVERY_UNAVAILABLE일 때만 true입니다. 정의된 그 밖의 클라이언트, 인가, 리소스 없음, 유효성 검사, 상태 충돌 오류에는 false입니다. */
                retryable: boolean;
                /** @description 진단과 지원에 사용하는 불투명한 서버 상관관계 식별자입니다. 도메인 의미는 없습니다. */
                traceId: string;
            } & unknown;
        };
        /** @description 기존 공유 카드 커서와 정렬을 사용합니다. actor나 추천 출처를 클라이언트가 지정할 수 없습니다. */
        FeedResultRequest: {
            /** @description 첫 페이지에는 생략합니다. 명시적인 null 또는 빈 값은 허용하지 않습니다. */
            cursor?: components["schemas"]["Cursor"];
            /**
             * @description 페이지 크기이며 기본값은 20입니다.
             * @default 20
             */
            limit: number;
        };
        /** @description actor, 학원, 실제 카드와 위치, 생성 시각을 저장한 페이지입니다. 맥락 생성 자체는 노출·클릭·방문을 기록하지 않습니다. */
        FeedResultResponse: {
            /** @description 맥락 생성 시각입니다. */
            createdAt: components["schemas"]["UtcInstant"];
            /** @description createdAt에서 정확히 24시간 뒤입니다. */
            expiresAt: components["schemas"]["UtcInstant"];
            /** @description 실제로 전달한 순서의 기존 공유 카드입니다. 배열 인덱스가 position이며 빈 페이지도 맥락을 생성합니다. */
            items: components["schemas"]["SharedCard"][];
            /** @description 최신순 페이지에는 추천 모델 버전이 없습니다. */
            modelVersion: null;
            /** @description 기존 공유 카드 커서입니다. 마지막 페이지는 null입니다. */
            nextCursor: string | null;
            /** @description 최신순 페이지에는 추천 결과 식별자가 없습니다. */
            recommendationResultId: null;
            /** @description 서버가 생성한 결과 맥락 UUID입니다. */
            resultContextId: components["schemas"]["Uuid"];
            /**
             * @description 서버가 결정한 최신순 정렬 출처입니다.
             * @constant
             */
            sortSource: "LATEST";
        };
        FieldError: {
            /** @description 이 유효성 검사 실패와 관련된 잘못된 요청 필드, 매개 변수 또는 헤더의 이름입니다. */
            field: string;
            /** @description 해당 필드 오류를 사람이 읽을 수 있게 설명한 문장입니다. */
            message: string;
        };
        Follow: {
            /** @description 이 목록이 나타내는 현재 관계의 시작 시점입니다. 팔로잉은 본인 → 상대방, 팔로워는 상대방 → 본인이며 역방향 관계의 시작 시점과 같을 필요가 없습니다. */
            followedAt: components["schemas"]["UtcInstant"];
            /** @description 선택 학원에서 현재 상대방 → 본인의 유효 팔로우 여부입니다. */
            isFollowedBy: boolean;
            /** @description 선택 학원에서 현재 본인 → 상대방의 유효 팔로우 여부입니다. */
            isFollowing: boolean;
            /** @description 현재 상대 학생의 비어 있지 않은 닉네임입니다. */
            nickname: string;
            /** @description 상대 학생의 안정적인 UUID입니다. */
            studentId: components["schemas"]["Uuid"];
        };
        FollowPage: {
            /**
             * Format: int64
             * @description 검색·커서·페이지 크기와 무관한 선택 학원의 모든 유효 incoming 관계 수입니다.
             */
            followerCount: number;
            /**
             * Format: int64
             * @description 검색·커서·페이지 크기와 무관한 선택 학원의 모든 유효 outgoing 관계 수입니다.
             */
            followingCount: number;
            /** @description 현재 학원의 유효 관계 검색 결과이며 followedAt DESC, studentId DESC 순입니다. */
            items: components["schemas"]["Follow"][];
            /** @description 다음 검색 결과를 이어 읽는 불투명 커서이며 더 없으면 null입니다. */
            nextCursor: string | null;
        };
        KnownCardBalanceAccount: {
            /** @description 이 카드 잔액 계정이 속한 학원의 UUID입니다. */
            academyId: components["schemas"]["Uuid"];
            /** @description 가장 최근에 성공한 외부 카드 잔액 조회에서 관측된 음수가 아닌 정수 KRW입니다. */
            actualCardBalance: components["schemas"]["KrwNonNegative"];
            /** @description 응답 조회 시점에 계정 범위 잔액 조정 건이 OPEN일 때만 true입니다. RESOLVED 이력만 있는 경우를 포함해 OPEN 건이 없으면 false입니다. 계정에 저장하지 않고 파생하는 이 플래그와 잔액 필드는 하나의 일관된 계정 프로젝션에서 가져옵니다. 이후 조회가 실패하면 가장 최근에 성공한 금액은 유지하되 이 플래그는 현재 잔액 조정 건 상태를 반영합니다. */
            balanceAdjustmentInProgress: boolean;
            /**
             * @description KNOWN은 성공한 외부 잔액 관측이 하나 이상 있고 그 관측에서 반환 잔액 값을 얻었음을 뜻합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            balanceKnowledge: "KNOWN";
            /** @description 학생 카드 잔액 계정의 안정적인 UUID입니다. */
            cardBalanceAccountId: components["schemas"]["Uuid"];
            /** @description 화면 표시용 음수 아닌 정수 KRW이며 max(0, ledgerAvailableBalance)와 같습니다. */
            displayAvailableBalance: components["schemas"]["KrwNonNegative"];
            /** @description 반환 금액의 근거가 된 성공 관측의 RFC 3339 UTC Z 시점입니다. 이후 조회가 실패해도 이 값을 유지합니다. */
            lastRefreshedAt: components["schemas"]["UtcInstant"];
            /**
             * @description 가장 최근 조회 시도의 결과입니다. FAILED는 이전의 성공적인 관측에서 보존된 금액과 공존할 수 있습니다.
             * @enum {string}
             */
            lastRefreshStatus: "SUCCESS" | "FAILED";
            /** @description 부호 있는 정수 KRW는 actualCardBalance에서 활성 위시가 보유한 총계를 뺀 것과 같습니다. 음수 값이 유지됩니다. */
            ledgerAvailableBalance: components["schemas"]["KrwSigned"];
            /** @description 음수가 아닌 정수 KRW는 max(0, -ledgerAvailableBalance)와 같습니다. 0은 해결되지 않은 부족이 없음을 의미합니다. */
            unresolvedShortage: components["schemas"]["KrwNonNegative"];
        };
        /** Format: int64 */
        KrwNonNegative: number;
        /** Format: int64 */
        KrwPositive: number;
        /**
         * Format: int64
         * @description 소수 단위의 KRW 금액은 절대 허용하지 않습니다.
         */
        KrwSigned: number;
        /** @enum {string} */
        LedgerEventType: "CARD_BALANCE_CHANGE" | "WISH_DEPOSIT" | "WISH_WITHDRAWAL" | "WISH_TRANSFER" | "WISH_COMPLETION_RETURN" | "WISH_ABANDONMENT_RETURN" | "WISH_DELETION_RETURN";
        MonthlyRecapGroupComparison: {
            /** @description achievementPercentileStatus가 ok일 때의 1~99 백분위이며 나머지 상태에서는 null입니다. */
            achievementPercentile: number | null;
            /**
             * @description 목표 달성 비교 결과이며 viewer의 대표 위시 달성값 자체가 없으면 null입니다.
             * @enum {string|null}
             */
            achievementPercentileStatus: "ok" | "no_peers" | "all_tied" | null;
            /** @description habitPercentileStatus가 ok일 때의 1~99 백분위이며 나머지 상태에서는 null입니다. */
            habitPercentile: number | null;
            /**
             * @description 습관 비교값이 계산되었는지, peer가 없는지, 모두 동점인지 구분합니다.
             * @enum {string}
             */
            habitPercentileStatus: "ok" | "no_peers" | "all_tied";
            /** @description 목표 달성 백분위 상태 문구이며 viewer의 비교값이 없으면 null입니다. */
            messageAchievement: string | null;
            /** @description 습관 백분위 상태에 대응하며 peer identity를 포함하지 않는 문구입니다. */
            messageHabit: string;
        } & (unknown & unknown & unknown & unknown);
        MonthlyRecapObjectivePerformance: {
            /** @description 완료 월에 종결된 소유 위시 수입니다. */
            completedWishCount: number;
            /** @description 대표 위시의 완료 월말 달성률이며 대표 위시가 없으면 null입니다. */
            currRatePct: number | null;
            /** @description 완료 월의 위시 완료 수를 설명하는 결정적 문구입니다. */
            messageCompletedCount: string;
            /** @description 대표 위시 달성률 변화를 설명하며 대표 위시가 없으면 null입니다. */
            messageRateChange: string | null;
            /** @description 완료 월의 총 순저축액을 설명하는 결정적 문구입니다. */
            messageTotalSavings: string;
            /** @description 대표 위시의 이전 월말 달성률이며 대표 위시가 없으면 null입니다. */
            prevRatePct: number | null;
            /** @description 생성 snapshot의 대표 위시 제목이며 대표 위시가 없으면 null입니다. */
            representativeWishTitle: string | null;
            /** @description 완료 월의 유효 입금에서 출금과 반환 효과를 반영한 순저축 원화 금액입니다. */
            totalSavings: components["schemas"]["KrwSigned"];
        };
        MonthlyRecapPacePrediction: {
            /** @description 완료 월 전체 계정 순저축액을 달력 일수로 나눈 일평균 원화 속도입니다. */
            dailyPace: number;
            /**
             * Format: date
             * @description 대표 위시의 동결된 속도로 계산한 예상 완료일이며 계산할 수 없으면 null입니다.
             */
            expectedCompletionDate: string | null;
            /** @description 완료 월의 계정 전체 일평균 속도를 설명하는 문구입니다. */
            messageDailyPace: string;
            /** @description 예상 완료일 또는 이미 달성한 상태를 설명하며 계산할 수 없으면 null입니다. */
            messageExpectedDate: string | null;
            /** @description 목표일까지 필요한 추가 일평균 저축액을 설명하며 계산할 수 없으면 null입니다. */
            messageRequiredDaily: string | null;
            /** @description 대표 위시 목표일까지 필요한 일평균 원화 금액이며 계산 대상이나 유효 기한이 없으면 null입니다. */
            requiredDailyAmount: number | null;
        };
        MonthlyRecapPatternAnalysis: {
            /** @description 완료 월의 1회 평균 저축액을 설명하는 문구입니다. */
            messageAvgAmount: string;
            /** @description 입금 날짜 간격으로 계산한 규칙성 안내 문구입니다. */
            messageRegularity: string;
            /** @description 최다 저축 주차와 요일 또는 데이터 부족을 설명하는 문구입니다. */
            messageWeekWeekday: string;
            /** @description 완료 월에서 유효 입금 합계가 가장 큰 1~5주차이며 입금이 없으면 null입니다. */
            topWeek: number | null;
            /**
             * @description 완료 월에서 유효 입금 빈도가 가장 높은 요일이며 입금이 없으면 null입니다.
             * @enum {string|null}
             */
            topWeekday: "월요일" | "화요일" | "수요일" | "목요일" | "금요일" | "토요일" | "일요일" | null;
        };
        MonthlyRecapResponse: {
            /** @description 생성 행이 결속한 고정 알고리즘 버전이며 생성 이력이 없으면 null입니다. */
            algorithmVersion: "recap-1" | null;
            /** @description current 성공 또는 확정 부적격 상태를 영속 저장한 UTC 시점이며 아직 확정되지 않았으면 null입니다. */
            generatedAt: components["schemas"]["UtcInstant"] | null;
            /** @description 논리 월간 기간의 단조 증가 생성 버전이며 생성 이력이 없으면 null입니다. */
            generationVersion: number | null;
            /**
             * @description 이 리소스가 완료된 월간 리캡임을 나타내는 고정 판별자입니다.
             * @constant
             */
            kind: "MONTHLY";
            /** @description 요청에서 선택된 완료 월의 반개구간 Asia/Seoul 날짜 경계입니다. */
            period: components["schemas"]["RecapPeriod"];
            /** @description SUCCEEDED일 때만 존재하는 불변 월간 view이며 나머지 공개 상태에서는 null입니다. */
            result: components["schemas"]["MonthlyRecapResult"] | null;
            /**
             * @description 이 공개 응답과 저장 view를 해석하는 고정 스키마 버전입니다.
             * @constant
             */
            schemaVersion: 1;
            /**
             * @description 사용 가능한 current 성공을 우선하며 유효 입금 세 건 미만을 NOT_ELIGIBLE로 구분하는 월간 공개 상태입니다.
             * @enum {string}
             */
            status: "NOT_GENERATED" | "GENERATING" | "NOT_ELIGIBLE" | "FAILED" | "SUCCEEDED";
        } & (unknown & unknown & unknown & unknown);
        MonthlyRecapResult: {
            /** @description 식별자를 제거한 peer scalar 배열로 계산한 비교 결과입니다. */
            groupComparison: components["schemas"]["MonthlyRecapGroupComparison"];
            /** @description 생성 시점 분류에서 이 월간 view가 활동 기준을 충족했는지 나타냅니다. */
            isActive: boolean;
            /** @description 완료 월의 저축액, 완료 위시와 대표 위시 달성률 변화입니다. */
            objectivePerformance: components["schemas"]["MonthlyRecapObjectivePerformance"];
            /** @description 동결된 reference date와 대표 위시 snapshot으로 계산한 페이스 예측입니다. */
            pacePrediction: components["schemas"]["MonthlyRecapPacePrediction"];
            /** @description 완료 월의 저축 주차·요일·규칙성·평균 금액 문구입니다. */
            patternAnalysis: components["schemas"]["MonthlyRecapPatternAnalysis"];
            /** @description 저장된 Python 월간 view가 표시하는 연도와 월입니다. */
            period: components["schemas"]["MonthlyRecapViewPeriod"];
            /** @description 동결된 recap-1 분류 우선순위로 선택한 저축 유형입니다. */
            typeSection: components["schemas"]["MonthlyRecapTypeSection"];
        };
        MonthlyRecapTypeSection: {
            /** @description 선택된 저축 유형과 fallback 여부에 대응하는 결정적 문구입니다. */
            message: string;
            /**
             * @description recap-1의 네 가지 저축 유형 중 우선순위 규칙으로 선택한 제목입니다.
             * @enum {string}
             */
            typeTitle: "불도저형 토끼" | "꾸준형 토끼" | "단기 집중형 토끼" | "탐색형 토끼";
        };
        MonthlyRecapViewPeriod: {
            /** @description Python 월간 view가 표시하는 1부터 12까지의 월입니다. */
            month: number;
            /** @description Python 월간 view가 표시하는 달의 네 자리 연도입니다. */
            year: number;
        };
        ProgressSharedCard: {
            /** @description 응답 조회 시점에 소유자의 카드 잔액 계정에 OPEN 잔액 조정 건이 있을 때만 true입니다. 잔액 조정 건이 없거나 RESOLVED 이력만 있으면 false입니다. 이 값은 공유 카드에 저장되지 않으며 contentUpdatedAt이나 정렬 순서를 갱신하지 않습니다. */
            balanceAdjustmentInProgress: boolean;
            /** @description 임시 정렬에 사용하는 가장 최근 콘텐츠 또는 게시 상태 변경의 RFC 3339 UTC Z 시점입니다. 조회 시점의 관계 검사와 balanceAdjustmentInProgress는 이 값을 바꾸지 않습니다. */
            contentUpdatedAt: components["schemas"]["UtcInstant"];
            /**
             * @description 현재 게시된 미완료 위시 카드를 식별하는 PROGRESS 판별자입니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            kind: "PROGRESS";
            /** @description 작성 학생의 안정적인 UUID입니다. 학생 조회의 studentId와 같으며 sharedCardId 및 비공개 wishId와 구별됩니다. 닉네임 변경이나 완료 카드 교체 후에도 유지됩니다. */
            ownerId: components["schemas"]["Uuid"];
            /** @description 소유자의 현재 표시 닉네임이며 식별 키가 아닙니다. 작성자 식별은 ownerId를 사용합니다. 실명, 별도 studentId 속성, 계정 데이터 또는 실제 카드 데이터는 노출하지 않습니다. */
            ownerNickname: string;
            /** @description 현재 권한 검사 뒤 발급된 5분 비공개 사진 URL 세트이며 첨부 사진이 없으면 null입니다. */
            photo: components["schemas"]["WishPhoto"] | null;
            /** @description 내림 정수 나눗셈으로 계산합니다. 목표 미도달 진행률은 최대 99이고 목표에 도달했을 때만 100을 반환합니다. */
            progressPercent: number;
            /** @description 게시된 NFC 정규화 위시 목적입니다. */
            purpose: components["schemas"]["Purpose"];
            /** @description 개인정보를 노출하지 않는 이 공유 카드 프로젝션의 안정적인 UUID입니다. 기반 위시 또는 계정 식별자는 노출하지 않습니다. */
            sharedCardId: components["schemas"]["Uuid"];
            /**
             * Format: date
             * @description 저장된 위시 시작 달력 날짜 LocalDate를 YYYY-MM-DD 또는 null로 직접 투영합니다. 필드는 항상 존재하며 미지정은 null입니다. 생성 시각이나 오늘 날짜로 보충하거나 시간대를 변환하지 않습니다.
             */
            startDate: string | null;
            /** @description 게시된 양의 정수 KRW 목표 금액입니다. 소유자의 정확한 현재 위시 금액은 노출하지 않습니다. */
            targetAmount: components["schemas"]["KrwPositive"];
            /**
             * Format: date
             * @description 저장된 위시 목표 달력 날짜 LocalDate를 YYYY-MM-DD 또는 null로 직접 투영합니다. 필드는 항상 존재하며 미지정은 null입니다. 생성 시각이나 오늘 날짜로 보충하거나 시간대를 변환하지 않습니다.
             */
            targetDate: string | null;
        };
        /** @description NFC로 정규화되고 앞뒤 경계 공백이 없으며 1~200개의 유니코드 코드 포인트를 포함하는 텍스트입니다. Cc, Cf, Zl, Zp 문자는 금지하고 내부 Space_Separator 문자는 유지합니다. */
        Purpose: string;
        /**
         * @description purpose 요청은 다음 순서로 정규화합니다.
         *     1. 요청 값을 문자열로 디코딩합니다.
         *     2. 디코딩된 입력 어디에든 유니코드 일반 범주 Cc, Cf, Zl, Zp가 있으면 422 INVALID_PURPOSE로 거부합니다.
         *     3. ASCII SPACE와 NBSP U+00A0을 포함한 앞뒤의 모든 유니코드 Space_Separator 코드 포인트(일반 범주 Zs)를 반복해서 제거하되 내부 공백은 유지합니다.
         *     4. 경계 공백을 제거한 값을 유니코드 NFC로 정규화합니다.
         *     5. NFC 정규화 후 유니코드 코드 포인트 수를 셉니다. 1~200개이면 저장하고 반환하며, 그 밖의 경우 422 INVALID_PURPOSE를 반환합니다.
         */
        PurposeInput: string;
        RecapPeriod: {
            /**
             * Format: date
             * @description 선택한 리캡 기간의 Asia/Seoul 제외 종료일입니다.
             */
            endDateExclusive: string;
            /**
             * Format: date
             * @description 선택한 리캡 기간의 Asia/Seoul 포함 시작일입니다.
             */
            startDate: string;
            /**
             * @description 기간 날짜 경계를 해석하는 고정 IANA 시간대입니다.
             * @constant
             */
            timezone: "Asia/Seoul";
        };
        RepresentativeWishSelectionRequest: {
            /** @description 이 카드 잔액 계정에서 대표로 선택할, 삭제되지 않은 활성 위시의 UUID입니다. */
            wishId: components["schemas"]["Uuid"];
        };
        SharedCard: components["schemas"]["ProgressSharedCard"] | components["schemas"]["CompletionSharedCard"] | components["schemas"]["AbandonmentSharedCard"];
        SharedCardPage: {
            /** @description 현재 조회 가능한 진행 카드, 완료 카드, 포기 카드를 임시로 contentUpdatedAt DESC, sharedCardId DESC 순으로 정렬합니다. */
            items: components["schemas"]["SharedCard"][];
            /** @description 현재 조회 문맥에 바인딩된 HMAC 서명 불투명 커서입니다. 추가로 조회 가능한 행이 있을 때만 최종 반환 행의 contentUpdatedAt/sharedCardId에서 생성하며 빈 결과와 마지막 페이지는 null입니다. */
            nextCursor: string | null;
        };
        StudentBlock: {
            /** @description 현재 단방향 차단이 생성되거나 다시 생성된 RFC 3339 UTC Z 시점입니다. */
            blockedAt: components["schemas"]["UtcInstant"];
            /** @description 차단된 학생의 현재 닉네임이며 공백 문자열이 아닙니다. */
            nickname: string;
            /** @description 차단된 학생의 안정적인 UUID입니다. */
            studentId: components["schemas"]["Uuid"];
        };
        StudentBlockPage: {
            /** @description 인증된 학생이 생성한 활성 블록으로, blockedAt 내림차순, studentId 내림차순으로 정렬됩니다. */
            items: components["schemas"]["StudentBlock"][];
            /** @description 최종 반환된 (blockedAt, studentId) 튜플에서 파생된 불투명 커서입니다. 더 이상 항목이 없으면 null입니다. */
            nextCursor: string | null;
        };
        StudentRelationship: {
            /** @description 선택 학원에서 현재 상대방 → 본인의 유효 팔로우 여부입니다. */
            isFollowedBy: boolean;
            /** @description 선택 학원에서 현재 본인 → 상대방의 유효 팔로우 여부입니다. */
            isFollowing: boolean;
            /** @description 현재 조회 대상 학생의 비어 있지 않은 닉네임입니다. */
            nickname: string;
            /** @description 조회 대상 학생의 안정적인 UUID입니다. 정확한 자기 ID 조회도 허용합니다. */
            studentId: components["schemas"]["Uuid"];
        };
        StudentRelationshipPage: {
            /** @description 본인, 현재 학원 구성원이 아닌 학생, 양방향 차단 대상을 제외한 같은 학원 검색 결과입니다. nickname ASC, studentId ASC 순으로 정렬합니다. */
            items: components["schemas"]["StudentRelationship"][];
            /** @description 최종 반환된 (닉네임, studentId) 튜플 및 정규화된 닉네임 필터에서 파생된 불투명 커서입니다. 더 이상 항목이 없으면 null입니다. */
            nextCursor: string | null;
        };
        UnknownCardBalanceAccount: {
            /** @description 이 카드 잔액 계정이 속한 학원의 UUID입니다. */
            academyId: components["schemas"]["Uuid"];
            /** @description 성공한 외부 잔액 관측이 없으므로 항상 null입니다. null은 0 KRW가 아니라 알 수 없음을 뜻합니다. */
            actualCardBalance: null;
            /**
             * @description OPEN 잔액 조정 건에는 성공적인 잔액 관측이 필요하지만 UNKNOWN 계정에는 없기 때문에 항상 false입니다.
             * @constant
             */
            balanceAdjustmentInProgress: false;
            /**
             * @description UNKNOWN은 성공한 외부 잔액 관측이 한 번도 없음을 뜻합니다. null인 잔액 값을 절대 0으로 해석하면 안 됩니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            balanceKnowledge: "UNKNOWN";
            /** @description 학생 카드 잔액 계정의 안정적인 UUID입니다. */
            cardBalanceAccountId: components["schemas"]["Uuid"];
            /** @description 실제 카드 잔액을 알기 전까지 항상 null입니다. UI에서 0 KRW로 표시하면 안 됩니다. */
            displayAvailableBalance: null;
            /** @description 성공한 관측이 없으므로 항상 null입니다. 실패한 시도 시점은 관측 이력에 따로 기록합니다. */
            lastRefreshedAt: null;
            /**
             * @description 성공한 관측이 생기기 전에 가장 최근 조회 시도가 실패했으면 FAILED입니다. 기록된 조회 시도가 없으면 null입니다.
             * @enum {string|null}
             */
            lastRefreshStatus: "FAILED" | null;
            /** @description 실제 카드 잔액을 알기 전까지 항상 null입니다. 서비스가 임의의 0을 만들어 이 값을 계산하면 안 됩니다. */
            ledgerAvailableBalance: null;
            /** @description 실제 카드 잔액을 알기 전까지 항상 null입니다. 부족액을 알 수 없는 것과 부족액이 없는 것은 다릅니다. */
            unresolvedShortage: null;
        };
        /** Format: date */
        UtcDate: string;
        /**
         * Format: date-time
         * @description 와이어 표현이 Z로 끝나는 RFC 3339 UTC 시점입니다.
         */
        UtcInstant: string;
        /** Format: uuid */
        Uuid: string;
        WeeklyRecapAcademySuccessStories: {
            /** @description 현재 노출 가능한 성공 story 수에 맞춘 결정적 요약 문구입니다. */
            messageSummary: string;
            /** @description 저장 후보 중 현재 공개 조건을 다시 통과한 최대 다섯 건의 결정적 순서 목록입니다. */
            stories: components["schemas"]["WeeklyRecapStory"][];
        };
        WeeklyRecapAchievement: {
            /** @description 정해진 알고리즘 문구로 만든 주간 성취 안내입니다. */
            message: string;
            /** @description 완료 주의 유효 입금에서 출금을 뺀 순저축 원화 금액입니다. */
            netSavings: components["schemas"]["KrwSigned"];
            /** @description 완료 주에 생성된 소유 위시 수입니다. */
            newWishCount: number;
            /** @description 완료 주의 유효 입금 횟수입니다. */
            saveCount: number;
        };
        WeeklyRecapGrowthReport: {
            /** @description 이전 주 방문이 0보다 클 때의 반올림 증감률이며 기준 방문이 0이면 null입니다. */
            growthPct: number | null;
            /** @description 이전 주 대비 증감률 안내이며 증감률을 정의할 수 없으면 null입니다. */
            messageGrowth: string | null;
            /** @description 완료 주 방문 횟수와 고유 방문자 수를 설명하는 문구입니다. */
            messageVisits: string;
            /** @description 완료 주에 받은 유효 프로필 방문 횟수입니다. */
            totalVisits: number;
            /** @description 완료 주에 방문한 고유한 유효 학생 수입니다. */
            uniqueVisitors: number;
        };
        WeeklyRecapLastWeekPerformance: {
            /** @description 완료 주의 유효 저축 횟수, 순저축액과 새 위시 수입니다. */
            achievement: components["schemas"]["WeeklyRecapAchievement"];
            /** @description 완료 주에 대표 위시가 통과한 마일스톤 표시 정보입니다. */
            milestone: components["schemas"]["WeeklyRecapMilestone"];
            /** @description 완료 주부터 과거로 이어진 연속 저축 주 정보입니다. */
            streak: components["schemas"]["WeeklyRecapStreak"];
        };
        WeeklyRecapMilestone: {
            /** @description 마일스톤을 통과했을 때의 안내 문구이며 통과하지 않았거나 대표 위시가 없으면 null입니다. */
            message: string | null;
            /** @description 완료 주 종료 시점 대표 위시 달성률의 반올림 정수이며 계산 대상이 없으면 null입니다. */
            rateAfter: number | null;
            /** @description 완료 주 시작 직전 대표 위시 달성률의 반올림 정수이며 계산 대상이 없으면 null입니다. */
            rateBefore: number | null;
            /** @description 완료 주 기준 대표 위시 제목이며 대표 위시가 없으면 null입니다. */
            wishTitle: string | null;
        };
        WeeklyRecapResponse: {
            /** @description 생성 행이 결속한 고정 알고리즘 버전이며 생성 이력이 없으면 null입니다. */
            algorithmVersion: "recap-1" | null;
            /** @description current 성공 결과를 영속 저장한 UTC 시점이며 성공 결과가 없으면 null입니다. */
            generatedAt: components["schemas"]["UtcInstant"] | null;
            /** @description 논리 주간 기간의 단조 증가 생성 버전이며 생성 이력이 없으면 null입니다. */
            generationVersion: number | null;
            /**
             * @description 이 리소스가 완료된 주간 리캡임을 나타내는 고정 판별자입니다.
             * @constant
             */
            kind: "WEEKLY";
            /** @description 요청에서 선택된 완료 주의 반개구간 Asia/Seoul 날짜 경계입니다. */
            period: components["schemas"]["RecapPeriod"];
            /** @description SUCCEEDED일 때만 존재하는 불변 주간 view이며 활동 0도 null 대신 이 객체로 표현합니다. */
            result: components["schemas"]["WeeklyRecapResult"] | null;
            /**
             * @description 이 공개 응답과 저장 view를 해석하는 고정 스키마 버전입니다.
             * @constant
             */
            schemaVersion: 1;
            /**
             * @description 사용 가능한 current 성공을 우선한 주간 공개 생성 상태입니다. SUPERSEDED는 노출하지 않습니다.
             * @enum {string}
             */
            status: "NOT_GENERATED" | "GENERATING" | "FAILED" | "SUCCEEDED";
        } & (unknown & unknown & unknown);
        WeeklyRecapResult: {
            /** @description 지난주 저축 성과, 대표 위시 마일스톤과 연속 저축 기간입니다. */
            page1LastWeekPerformance: components["schemas"]["WeeklyRecapLastWeekPerformance"];
            /** @description 지난주 수신 프로필 방문과 이전 주 대비 변화입니다. */
            page2GrowthReport: components["schemas"]["WeeklyRecapGrowthReport"];
            /** @description 현재 읽기 권한을 다시 통과한 학원 성공 story 목록입니다. */
            page3AcademySuccessStories: components["schemas"]["WeeklyRecapAcademySuccessStories"];
            /** @description 저장된 Python 주간 view의 포함 시작일과 포함 종료일입니다. */
            period: components["schemas"]["WeeklyRecapViewPeriod"];
        };
        WeeklyRecapStory: {
            /** @description 현재 조회 시점에 허용된 공유 카드 소유 학생 UUID입니다. */
            ownerStudentId: components["schemas"]["Uuid"];
            /** @description 현재 조회 시점에 허용된 공유 카드 프로젝션 UUID입니다. */
            sharedCardId: components["schemas"]["Uuid"];
            /** @description 작성자의 완료 달 이전 달 집계로 계산해 저장한 유형 제목이며 계산할 수 없으면 null입니다. */
            typeTitle: string | null;
            /** @description 저장된 성공 story 후보가 가리키는 위시 UUID입니다. */
            wishId: components["schemas"]["Uuid"];
        };
        WeeklyRecapStreak: {
            /** @description 연속 저축 주 수에 대응하는 결정적 안내 문구입니다. */
            message: string;
            /** @description 완료 주부터 연속으로 유효 입금이 있었던 주 수입니다. */
            streakWeeks: number;
        };
        WeeklyRecapViewPeriod: {
            /**
             * Format: date
             * @description Python 주간 view가 표시하는 포함 일요일입니다. wrapper period의 endDateExclusive 하루 전입니다.
             */
            weekEnd: string;
            /**
             * Format: date
             * @description Python 주간 view가 표시하는 포함 월요일입니다.
             */
            weekStart: string;
        };
        Wish: {
            /** @description 성공적으로 포기하기 직전에 이 위시에 할당되어 있던 불변의 소유자 전용 금액입니다. ABANDONED에서는 0을 포함해 targetAmount 이하의 정확한 정수 KRW이고, IN_PROGRESS, AMOUNT_REACHED, COMPLETED에서는 명시적인 null입니다. 현재 할당액, 실제 카드 잔액, 반환 합계, targetAmount 또는 삭제 값이 아닙니다. 포기 후 논리 삭제와 멱등 재생에서도 최초 값을 그대로 보존합니다. */
            abandonmentAmount: components["schemas"]["KrwNonNegative"] | null;
            /**
             * Format: int64
             * @description 완료된 위시의 경우 createdAt부터 completedAt까지 경과된 전체 초입니다. 그렇지 않으면 null입니다.
             */
            actualDurationSeconds: number | null;
            /** @description 현재 이 위시에 할당된 음수가 아닌 정수 KRW입니다. 실제 카드 잔액과 다르며 targetAmount를 초과하지 않습니다. */
            amount: components["schemas"]["KrwNonNegative"];
            /** @description 이 위시의 카드 잔액 계정에 응답 스냅샷 기준 OPEN 잔액 조정 건이 있을 때만 true입니다. 이 값은 파생 값이며 위시나 공유 카드에 저장되지 않습니다. 목록·상세 응답은 조회 시점 값을, 변경 응답은 변경이 커밋된 후의 값을 반영합니다. 잔액 조정 건을 열거나 해결해도 위시의 version이나 updatedAt은 증가하지 않습니다. 이 프로젝션은 이 boolean 값만 노출하며 부족액, adjustmentCaseId, observationId, 이벤트 링크 또는 계정 이력은 절대 노출하지 않습니다. */
            balanceAdjustmentInProgress: boolean;
            /** @description 이 위시가 영구적으로 연결된 소유자의 카드 잔액 계정 UUID입니다. */
            cardBalanceAccountId: components["schemas"]["Uuid"];
            /**
             * Format: date-time
             * @description 수명 주기 종료의 RFC 3339 UTC Z 시점입니다. COMPLETED에서는 completedAt과 정확히 같고, ABANDONED에서는 내부에 영속된 abandonedAt과 같으며, IN_PROGRESS와 AMOUNT_REACHED에서는 null입니다. targetDate, updatedAt, 논리 삭제 시각과 무관합니다.
             */
            closedAt: string | null;
            /**
             * Format: date-time
             * @description COMPLETED 위시를 명시적으로 완료한 RFC 3339 UTC Z 시점입니다. 다른 모든 상태에서는 null입니다.
             */
            completedAt: string | null;
            /** @description 위시가 생성된 RFC 3339 UTC Z 시점입니다. */
            createdAt: components["schemas"]["UtcInstant"];
            /** @description 이 위시의 안정적인 UUID입니다. */
            id: components["schemas"]["Uuid"];
            /** @description 현재 첨부 사진의 새 5분 비공개 URL 세트이며 사진이 없으면 null입니다. signed URL은 영속 domain snapshot이나 멱등 receipt에 저장하지 않습니다. */
            photo: components["schemas"]["WishPhoto"] | null;
            /** @description 이 위시에 저장된, NFC로 정규화되고 앞뒤 경계 공백이 없는 목적 텍스트입니다. */
            purpose: components["schemas"]["Purpose"];
            /**
             * Format: date
             * @description 사용자가 저축 계획의 시작일로 선택한 달력 날짜입니다. 시스템 생성 감사 시점인 createdAt, updatedAt, 수명 주기 종료 시점 및 실제 경과 기간과 독립적이며, 설정하지 않았거나 기존 데이터이면 null입니다.
             */
            startDate: string | null;
            /** @description 수명 주기 상태입니다. 목표 미만은 IN_PROGRESS, 목표에 도달했지만 명시적으로 완료하기 전은 AMOUNT_REACHED, 완료 후는 COMPLETED, 포기 후는 ABANDONED입니다. */
            state: components["schemas"]["WishState"];
            /** @description 이 위시에 대한 양의 정수 KRW 목표입니다. */
            targetAmount: components["schemas"]["KrwPositive"];
            /**
             * Format: date
             * @description 과거, 현재 또는 미래일 수 있는 선택적 달력 날짜입니다.
             */
            targetDate: string | null;
            /** @description 가장 최근에 성공한 위시 콘텐츠 또는 수명 주기 변경의 RFC 3339 UTC Z 시점입니다. */
            updatedAt: components["schemas"]["UtcInstant"];
            /** @description 이 스냅샷의 음수 아닌 낙관적 동시성 버전입니다. 상태를 바꾸는 변경이 성공하면 증가하고 멱등 재생은 최초 값을 반환합니다. */
            version: components["schemas"]["WishVersion"];
            /** @description 요청된 게시 범위 PRIVATE, FOLLOWERS 또는 ACADEMY; 현재 관계 및 차단 확인으로 인해 공유 카드가 더 숨겨질 수 있습니다. */
            visibility: components["schemas"]["WishVisibility"];
        };
        WishAbandonmentReturnMovement: {
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 계정 단위 포기 반환 프로젝션과 공유되는 불변 원장 이벤트의 UUID. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_ABANDONMENT_RETURN, 포기 중에 제거된 0이 아닌 자금을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_ABANDONMENT_RETURN";
            /** @description 포기 과정에서 위시 자금을 반환한 RFC 3339 UTC Z 시점입니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /**
             * @description 포기한 후에는 항상 0 KRW입니다.
             * @constant
             */
            wishAmountAfter: 0;
            /** @description 이 위시에서 반환된 음수 정수 KRW입니다. 반환액이 0이면 이벤트나 이력 항목을 만들지 않습니다. */
            wishAmountDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 포기가 발생했을 때 원장 효과에 의해 이 위시에 대해 포착된 불변의 목적입니다. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        };
        WishAmountCommand: {
            amount: components["schemas"]["KrwPositive"];
            expectedVersion: components["schemas"]["WishVersion"];
        };
        WishCompletionReturnMovement: {
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 계정 단위 완료 반환 프로젝션과 공유되는 불변 원장 이벤트의 UUID. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_COMPLETION_RETURN, 명시적 완료 중에 제거된 0이 아닌 자금을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_COMPLETION_RETURN";
            /** @description RFC 3339 UTC Z 완료 시점에 위시 자금이 반환되었습니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /**
             * @description 명시적 완료 후에는 항상 0 KRW입니다.
             * @constant
             */
            wishAmountAfter: 0;
            /** @description 이 위시에서 반환된 음수 정수 KRW입니다. 반환액이 0이면 이벤트나 이력 항목을 만들지 않습니다. */
            wishAmountDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 완료 시 원장 효과에 의해 이 위시에 대해 포착된 불변의 목적입니다. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        };
        WishDeletionReturnMovement: {
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 계정 단위 삭제 반환 프로젝션과 공유되는 불변 원장 이벤트의 UUID. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_DELETION_RETURN, 논리 삭제 중에 제거된 0이 아닌 자금을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_DELETION_RETURN";
            /** @description 논리 삭제 과정에서 위시 자금을 반환한 RFC 3339 UTC Z 시점입니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /**
             * @description 논리 삭제 후에는 항상 0 KRW입니다.
             * @constant
             */
            wishAmountAfter: 0;
            /** @description 이 위시에서 반환된 음수 정수 KRW입니다. 반환액이 0이면 이벤트나 이력 항목을 만들지 않습니다. */
            wishAmountDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 원장 효과에 의해 이 위시에 대해 포착된 불변의 삭제 시점 목적입니다. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        };
        WishDepositMovement: {
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 계정 단위 입금 프로젝션과 공유되는 불변 원장 이벤트의 UUID입니다. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_DEPOSIT, 이 위시에 추가된 자금을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_DEPOSIT";
            /** @description 이 불변 입금 이벤트가 발생한 RFC 3339 UTC Z 시점입니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 입금 직후 이 위시가 보유하는 음수가 아닌 정수 KRW입니다. */
            wishAmountAfter: components["schemas"]["KrwNonNegative"];
            /** @description 이 위시에 양의 정수 KRW가 추가되었습니다. */
            wishAmountDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 이벤트가 발생했을 때 원장 효과에 의해 이 위시에 대해 포착된 불변의 목적입니다. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        };
        WishFundMovement: components["schemas"]["WishDepositMovement"] | components["schemas"]["WishWithdrawalMovement"] | components["schemas"]["WishTransferMovement"] | components["schemas"]["WishCompletionReturnMovement"] | components["schemas"]["WishAbandonmentReturnMovement"] | components["schemas"]["WishDeletionReturnMovement"];
        WishFundMovementPage: {
            /** @description 이 위시에 대한 불변 원장 효과만 occurredAt DESC, eventId DESC 순으로 반환합니다. CARD_BALANCE_CHANGE는 절대 포함하지 않습니다. */
            items: components["schemas"]["WishFundMovement"][];
            /** @description 다른 항목이 존재할 때 최종 반환된 (occurredAt, eventId) 튜플에서 파생된 불투명 커서입니다. 빈 페이지와 종결 상태 페이지의 경우 null입니다. */
            nextCursor: string | null;
            /** @description 불변 효과를 반환하는 소유자의 활성 위시 또는 논리 삭제 위시에 대한 조회 시점 대상 맥락입니다. */
            wish: components["schemas"]["WishHistorySubject"];
        };
        WishHistoryReference: {
            /** @description 응답 조회 시점에 참조된 위시가 논리 삭제 상태이면 true입니다. */
            deletedWish: boolean;
            /** @description 현재 일반 위시 세부정보 탐색을 사용할 수 있는지 여부 deletedWish가 true이면 항상 false입니다. URL 또는 경로가 내보내지지 않습니다. */
            detailAvailable: boolean;
            /** @description 이 계정 단위 이벤트에서 참조하는 위시의 안정적인 UUID입니다. */
            wishId: components["schemas"]["Uuid"];
            /** @description 이벤트가 발생했을 때 원장 위시 효과에 의해 포착된 불변의 위시 목적입니다. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        } & unknown;
        WishHistorySubject: {
            /** @description 응답 조회 시점에 이 소유 위시가 논리 삭제 상태이면 true입니다. */
            deletedWish: boolean;
            /** @description deletedWish의 정확한 논리적 부정입니다. false이면 논리 삭제된 위시의 일반 상세 화면으로 이동할 수 없습니다. URL이나 경로는 반환하지 않습니다. */
            detailAvailable: boolean;
            /** @description 활성 위시의 현재 목적 또는 삭제된 위시에 대한 논리 삭제 직전에 캡처된 목적 스냅샷입니다. */
            displayPurpose: components["schemas"]["Purpose"];
            /** @description 불변 내역이 반환되는 소유 위시의 안정적인 UUID입니다. */
            wishId: components["schemas"]["Uuid"];
        } & unknown;
        WishMergePatch: {
            expectedVersion: components["schemas"]["WishVersion"];
            /**
             * Format: uuid
             * @description 생략하면 현재 사진을 유지하고, null이면 제거하며, 현재와 같은 UUID이면 no-op, 다른 UUID이면 소유한 unexpired Pending 사진으로 원자 교체합니다.
             */
            photoId?: string | null;
            purpose?: components["schemas"]["PurposeInput"];
            /**
             * Format: date
             * @description 선택적 계획 시작 달력 날짜입니다. 생략하면 기존 값을 유지하고 null이면 지우며, targetDate와 함께 제공되면 두 변경을 적용한 최종 날짜 쌍을 원자적으로 검증합니다.
             */
            startDate?: string | null;
            targetAmount?: components["schemas"]["KrwPositive"];
            /** Format: date */
            targetDate?: string | null;
            visibility?: components["schemas"]["WishVisibility"];
        } | unknown | unknown | unknown | unknown | unknown | unknown;
        WishMutationResult: {
            /**
             * Format: uuid
             * @description 변경으로 생성된 불변 원장 이벤트의 UUID입니다. 변경이 자금을 이동하지 않아 원장 이벤트를 만들지 않았으면 null입니다.
             */
            eventId: string | null;
            /** @description 변경 후의 권위 있는 위시 스냅샷입니다. 동일 요청의 멱등 재생이면 최초 스냅샷을 반환합니다. */
            wish: components["schemas"]["Wish"];
        };
        WishPage: {
            /** @description 삭제되지 않은 소유 위시는 createdAt 내림차순, ID 내림차순입니다. */
            items: components["schemas"]["Wish"][];
            /** @description 다음 위시 페이지에 대한 불투명 커서; 추가 페이지가 없으면 null입니다. */
            nextCursor: string | null;
        };
        WishPhoto: {
            /**
             * Format: date-time
             * @description 세 signed URL이 함께 만료되는 RFC 3339 UTC Z 시점이며 발급 시각에서 정확히 5분 뒤입니다.
             */
            expiresAt: string;
            /** @description Opaque 사진 identity입니다. 이를 아는 것만으로 읽기나 첨부 소유권이 생기지 않습니다. */
            id: components["schemas"]["Uuid"];
            /** @description 같은 private 사진의 360, 720, 1080 정사각형 JPEG signed URL 세 개입니다. */
            variants: components["schemas"]["WishPhotoVariants"];
        };
        WishPhotoUploadRequest: {
            /**
             * Format: binary
             * @description 정확히 하나만 허용되는 photo multipart 파트입니다. 선언 타입과 실제 decoded 타입이 모두 JPEG여야 하고 바이트 길이는 최대 5 MiB, decoded 크기는 정확히 1080x1080이어야 합니다. 멱등 콘텐츠 digest는 변환 전 수신한 이 파트의 정확한 바이트로 계산하며 multipart framing, boundary, filename은 포함하지 않습니다. filename은 선택 사항이며 타입 판단에 신뢰하지 않습니다.
             */
            photo: string;
        };
        WishPhotoVariants: {
            /**
             * Format: uri
             * @description 1080x1080 JPEG 비공개 signed URL입니다.
             */
            large: string;
            /**
             * Format: uri
             * @description 720x720 JPEG 비공개 signed URL입니다.
             */
            medium: string;
            /**
             * Format: uri
             * @description 360x360 JPEG 비공개 signed URL입니다.
             */
            small: string;
        };
        /** @enum {string} */
        WishState: "IN_PROGRESS" | "AMOUNT_REACHED" | "COMPLETED" | "ABANDONED";
        WishTransferMovement: {
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 이체 상대 위시의 이벤트 시점 목적과 조회 시점 논리 삭제 맥락입니다. */
            counterpartyWish: components["schemas"]["WishHistoryReference"];
            /**
             * @description 이 위시가 자금을 보냈으면 음수 wishAmountDelta를 갖는 SOURCE이고, 자금을 받았으면 양수 wishAmountDelta를 갖는 DESTINATION입니다.
             * @enum {string}
             */
            direction: "SOURCE" | "DESTINATION";
            /** @description 부호가 반대인 두 위시 이체 프로젝션이 공유하는 하나의 불변 원장 이벤트 UUID입니다. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_TRANSFER이며 동일 계정 위시의 원자적 이체에서 한쪽 효과를 식별합니다.
             * @constant
             */
            eventType: "WISH_TRANSFER";
            /** @description 이체의 두 불변 위시 효과가 공유하는 RFC 3339 UTC Z 시점입니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 이체 직후 이 위시가 보유한 음수가 아닌 정수 KRW입니다. */
            wishAmountAfter: components["schemas"]["KrwNonNegative"];
            /** @description 이 위시에 대한 부호 있는 정수 KRW 효과: SOURCE의 경우 음수이고 DESTINATION의 경우 양수입니다. */
            wishAmountDelta: components["schemas"]["KrwSigned"];
            /** @description 이체가 발생했을 때 이 위시의 원장 효과에 캡처된 불변 목적입니다. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        } & (unknown & {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            eventType: "WISH_TRANSFER";
        });
        WishTransferRequest: {
            amount: components["schemas"]["KrwPositive"];
            destinationExpectedVersion: components["schemas"]["WishVersion"];
            destinationWishId: components["schemas"]["Uuid"];
            sourceExpectedVersion: components["schemas"]["WishVersion"];
            sourceWishId: components["schemas"]["Uuid"];
        };
        WishTransferResult: {
            /** @description 원자적 이체 후의 권위 있는 도착 위시 스냅샷입니다. */
            destinationWish: components["schemas"]["Wish"];
            /** @description 두 이체 효과를 모두 포함하는 하나의 불변 원장 이벤트 UUID입니다. */
            eventId: components["schemas"]["Uuid"];
            /** @description 이체의 출발·도착 효과가 공유하는 RFC 3339 UTC Z 시점입니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 원자적 이체 후의 권위 있는 출발 위시 스냅샷입니다. */
            sourceWish: components["schemas"]["Wish"];
        };
        /**
         * Format: int64
         * @description 필수 요청 버전이 없거나 정수가 아니면 400 MALFORMED_REQUEST를 반환합니다. 디코딩된 버전이 음수이면 422 INVALID_VERSION, 음수가 아니지만 최신 버전과 다르면 409 VERSION_CONFLICT를 반환합니다.
         */
        WishVersion: number;
        WishVersionCommand: {
            expectedVersion: components["schemas"]["WishVersion"];
        };
        /**
         * @description 위시 공개 범위입니다. PRIVATE는 비공개, FOLLOWERS는 현재 viewer → owner 팔로우, ACADEMY는 기존 학원 공개 규칙입니다. 제거된 이전 공개 범위 값은 기존 enum 입력 오류인 400 MALFORMED_REQUEST입니다. FOLLOWERS는 선택 학원의 현재 viewer → owner 팔로우가 있어야 비소유자에게 공개됩니다. owner → viewer만으로는 공개되지 않으며 상호 팔로우는 필요하지 않습니다. 진행·완료 공유 카드의 목록·상세에 동일하게 적용합니다. 기존 소유자 예외, PRIVATE·ACADEMY 의미, 현재 학원 소속, 공유 카드의 카드 계정 자격과 종결 상태 필터, 전역 양방향 차단 우선순위를 유지합니다. 언팔로우·차단 후 다음 조회부터 제한된 카드를 숨기며 직접 조회는 SHARED_CARD_NOT_FOUND 경계를 유지합니다.
         * @enum {string}
         */
        WishVisibility: "PRIVATE" | "FOLLOWERS" | "ACADEMY";
        WishWithdrawalMovement: {
            /** @description 잔액 조정 건과 연결된 불변 이벤트 출처 정보이며, 연결된 잔액 조정 건이 없으면 null입니다. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description 이 새 이벤트가 보상하는 이전의 불변 동일 계정 이벤트이며, 보상 대상이 없으면 null입니다.
             */
            correctionOfEventId: string | null;
            /** @description 계정 단위 출금 프로젝션과 공유되는 불변 원장 이벤트의 UUID. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description 항상 WISH_WITHDRAWAL, 이 위시에서 제거된 자금을 식별합니다. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_WITHDRAWAL";
            /** @description 이 불변 출금 이벤트가 발생한 RFC 3339 UTC Z 시점입니다. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description 출금 직후 이 위시가 보유하는 음수가 아닌 정수 KRW입니다. */
            wishAmountAfter: components["schemas"]["KrwNonNegative"];
            /** @description 이 위시에서 음수 KRW가 제거되었습니다. */
            wishAmountDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description 이벤트가 발생했을 때 원장 효과에 의해 이 위시에 대해 포착된 불변의 목적입니다. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        };
    };
    responses: {
        /** @description ACADEMY_NOT_FOUND — 존재하지 않거나 현재 보이지 않는 학원이 숨겨져 있습니다. */
        AcademyNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description AUTH_REQUIRED — Bearer 토큰이 없거나 유효하지 않습니다. */
        AuthRequired: {
            headers: {
                "WWW-Authenticate": "Bearer";
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description BALANCE_SYNC_FAILED — 재시도할 수 있는 외부 잔액 조회 실패입니다. 실패한 관측은 위시를 변경하지 않은 채 저장됩니다. */
        BalanceSyncFailed: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description BALANCE_SYNC_FAILED 또는 PHOTO_DELIVERY_UNAVAILABLE — 외부 잔액 조회가 실패했거나 기존 사진의 새 5분 비공개 URL을 모두 발급할 수 없습니다. 두 경우 모두 위시 변경은 commit되지 않습니다. */
        BalanceSyncOrPhotoDeliveryUnavailable: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description CARD_BALANCE_ACCOUNT_NOT_FOUND — 계정이 없거나 종료되었거나, 인증된 학생이 소유하지 않거나, 다른 학원 소속인 경우를 숨깁니다. */
        CardBalanceAccountNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description BALANCE_MISMATCH_LOCKED, IDEMPOTENCY_KEY_REUSED, WISH_PHOTO_EXPIRED 또는 WISH_PHOTO_ALREADY_ATTACHED입니다. 일치하는 성공 결과의 멱등 재생을 현재 불일치 방어 조건보다 먼저 처리합니다. 캡처된 사진 상태가 식별자 없는 PHOTO_REVOKED이면 Wish 성공 본문, photoId, URL, Idempotency-Replayed 없이 WISH_PHOTO_EXPIRED입니다. 사진 첨부 실패는 위시를 생성하지 않습니다. */
        CreateConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description CARD_BALANCE_ACCOUNT_NOT_FOUND 또는 WISH_PHOTO_NOT_FOUND — 계정 부재·비소유·학원 불일치와 사진 부재·다른 소유자를 각각 숨깁니다. */
        CreateWishResourceNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT 또는 IDEMPOTENCY_KEY_REUSED. OPEN 잔액 불일치는 삭제를 차단하지 않습니다. */
        DeleteConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description MALFORMED_REQUEST, EXPECTED_VERSION_REQUIRED 또는 IDEMPOTENCY_KEY_REQUIRED. */
        DeletePreconditionRequired: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, BALANCE_MISMATCH_LOCKED, INSUFFICIENT_AVAILABLE_BALANCE, TARGET_AMOUNT_EXCEEDED, IDEMPOTENCY_KEY_REUSED 또는 WISH_PHOTO_EXPIRED. 일치하는 성공 receipt의 사진 상태가 PHOTO_REVOKED이면 Wish 성공 본문과 photo capability 없이 WISH_PHOTO_EXPIRED입니다. */
        DepositConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description FORBIDDEN — 인증 주체가 학생이 아닙니다. */
        Forbidden: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_AMOUNT — 디코딩된 정수 금액이 양수가 아니거나 허용 범위를 벗어났습니다. */
        InvalidAmount: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_AMOUNT, INVALID_PURPOSE 또는 INVALID_DATE_RANGE — 독립적으로 디코딩된 필드가 제약 조건을 위반했거나, 유효한 두 날짜의 최종 범위가 역전되었습니다. */
        InvalidAmountOrPurpose: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_AMOUNT 또는 INVALID_VERSION — 각각 독립적으로 디코딩한 amount 또는 expectedVersion이 제약 조건을 위반합니다. */
        InvalidAmountOrVersion: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_AMOUNT, INVALID_PURPOSE, INVALID_DATE_RANGE 또는 INVALID_VERSION — 독립적으로 디코딩된 필드가 제약 조건을 위반했거나, 원자적으로 적용한 최종 날짜 범위가 역전되었습니다. */
        InvalidAmountPurposeOrVersion: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_VERSION — 디코딩된 음수 If-Match 값은 음수가 아닌 버전 제약 조건을 위반합니다. */
        InvalidIfMatchVersion: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_PHOTO 또는 PHOTO_CONTENT_NOT_ALLOWED — JPEG 디코딩·정확한 1080x1080 크기가 유효하지 않거나 필수 콘텐츠 안전성 정책이 canonical 이미지의 사용을 거부했습니다. 안전성 category, likelihood, provider 결과는 반환하거나 product data로 보존하지 않습니다. */
        InvalidOrRejectedPhoto: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_AMOUNT 또는 INVALID_VERSION — 독립적으로 디코딩된 금액 또는 소스/대상 버전이 제약 조건을 위반합니다. */
        InvalidTransferAmountOrVersion: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_VERSION — 디코딩된 expectedVersion이 음수여서 음수 아닌 버전 제약 조건을 위반합니다. */
        InvalidVersion: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description UNSUPPORTED_MEDIA_TYPE — 요청 Content-Type은 application/json이어야 합니다. */
        JsonUnsupportedMediaType: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 누락되거나 정수가 아닌 필수 버전을 포함하는 MALFORMED_REQUEST 또는 IDEMPOTENCY_KEY_REQUIRED. */
        MalformedOrIdempotencyRequired: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description MALFORMED_REQUEST — 잘못된 형식의 JSON, 경로, 쿼리, 커서 또는 필수 동시성 구조(누락되거나 정수가 아닌 필수 버전 포함). */
        MalformedRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, BALANCE_MISMATCH_LOCKED, WISH_PHOTO_EXPIRED 또는 WISH_PHOTO_ALREADY_ATTACHED. 사진 교체 실패는 기존 attachment와 후보 Pending 사진을 바꾸지 않습니다. */
        PatchConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description PHOTO_DELIVERY_UNAVAILABLE — 기존 사진 또는 일치하는 Wish mutation 재생의 유효한 ACTIVE_PHOTO에 필요한 새 5분 비공개 URL을 모두 발급할 수 없습니다. 이 오류는 retryable true이고 receipt의 ACTIVE_PHOTO 또는 NO_PHOTO 상태를 바꾸지 않으며, 부분 Wish·transfer representation, 현재 사진 대체, 거짓 null, photoId, URL 또는 Idempotency-Replayed를 반환하지 않습니다. */
        PhotoDeliveryUnavailable: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description PHOTO_TOO_LARGE — photo 파트가 5 MiB를 초과하여 디코딩 전에 중단했습니다. */
        PhotoTooLarge: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description PHOTO_UPLOAD_RATE_LIMITED — rolling 처리 시도 또는 미첨부 Pending quota가 소진되었습니다. */
        PhotoUploadRateLimited: {
            headers: {
                "Retry-After": components["headers"]["RetryAfter"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description PHOTO_PROCESSING_UNAVAILABLE — 새 업로드의 필수 변환, 안전성 검사, 비공개 저장 또는 영속화 의존성을 일시적으로 사용할 수 없습니다. attachable identity 없이 부분 레코드와 객체를 보상 정리하며 terminal receipt를 생성하지 않아 같은 key와 콘텐츠를 재시도할 수 있습니다. PHOTO_DELIVERY_UNAVAILABLE — 보존 중인 유효한 ACTIVE_SUCCESS 재생에 필요한 새 5분 비공개 URL을 모두 발급할 수 없습니다. 부분 representation을 반환하거나 receipt를 변경·삭제하지 않습니다. 두 오류 모두 retryable true이며 사진 바이트, digest, photoId, receipt, URL, path, 안전성·provider 정보를 노출하지 않습니다. */
        PhotoUploadUnavailable: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description RECAP_QUERY_UNAVAILABLE — 저장된 리캡 상태를 일시적으로 읽을 수 없습니다. 생성 부재나 진행·부적격·실패 상태를 이 오류로 대체하지 않습니다. */
        RecapQueryUnavailable: {
            headers: {
                "Cache-Control": components["headers"]["CacheControlNoStore"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_STATE_TRANSITION — 지정한 동일 계정 위시가 COMPLETED 또는 ABANDONED 상태이므로 대표 위시로 선택할 수 없습니다. */
        RepresentativeWishSelectionConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description SELF_RELATIONSHIP — 자기 자신을 팔로우하거나 언팔로우할 수 없습니다. */
        SelfRelationshipConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description ACADEMY_NOT_FOUND 또는 SHARED_CARD_NOT_FOUND — 리소스 부재나 현재 공개 범위 조건 위반을 숨깁니다. */
        SharedCardOrAcademyNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, IDEMPOTENCY_KEY_REUSED 또는 WISH_PHOTO_EXPIRED. 일치하는 완료·포기 성공 receipt의 사진 상태가 PHOTO_REVOKED이면 Wish 성공 본문과 photo capability 없이 WISH_PHOTO_EXPIRED입니다. OPEN 잔액 불일치는 완료 또는 포기를 차단하지 않습니다. */
        StateMutationConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description SELF_RELATIONSHIP 또는 STUDENT_BLOCK_ALREADY_ACTIVE. */
        StudentBlockConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description STUDENT_BLOCK_NOT_FOUND — 부재, 해제된 상태 및 비소유권이 숨겨집니다. */
        StudentBlockNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description STUDENT_NOT_FOUND — 학생이 없거나 그 밖의 이유로 숨겨진 대상임을 공개하지 않습니다. */
        StudentNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description ACADEMY_NOT_FOUND 또는 STUDENT_NOT_FOUND — 학원 범위 검증 실패와 숨겨진 직접 대상의 세부 정보를 공개하지 않습니다. */
        StudentOrAcademyNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description ACADEMY_NOT_FOUND — 학원이 없거나, 다른 학원이거나, 현재 소속 학원이 아닌 범위를 숨깁니다. */
        StudentRelationshipAcademyNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description AUTH_REQUIRED — Bearer 토큰이 없거나 유효하지 않습니다. */
        StudentRelationshipAuthRequired: {
            headers: {
                "WWW-Authenticate": "Bearer";
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description FORBIDDEN — 인증 주체가 학생이 아닙니다. */
        StudentRelationshipForbidden: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description MALFORMED_REQUEST — JSON, UUID, nickname, limit 또는 불투명 커서의 형식이 잘못되었습니다. */
        StudentRelationshipMalformedRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, CROSS_ACCOUNT_TRANSFER_FORBIDDEN, INSUFFICIENT_WISH_AMOUNT, TARGET_AMOUNT_EXCEEDED, BALANCE_MISMATCH_LOCKED, IDEMPOTENCY_KEY_REUSED 또는 WISH_PHOTO_EXPIRED. 일치하는 이체 성공 receipt의 출발 또는 도착 사진 상태 중 하나라도 PHOTO_REVOKED이면 양쪽 URL을 발급하기 전에 전체 재생을 WISH_PHOTO_EXPIRED로 실패시키고 부분 본문을 반환하지 않습니다. */
        TransferConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description UNSUPPORTED_MEDIA_TYPE — PATCH에는 application/merge-patch+json이 필요합니다. */
        UnsupportedMediaType: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description UNSUPPORTED_PHOTO_TYPE — multipart/form-data가 아니거나 photo 파트 선언 타입·실제 디코딩 타입이 JPEG가 아니거나 서로 다릅니다. */
        UnsupportedPhotoType: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description CARD_BALANCE_ACCOUNT_NOT_FOUND, WISH_NOT_FOUND 또는 WISH_PHOTO_NOT_FOUND — 계정·위시·후보 사진의 부재나 비소유 상태를 리소스별 not-found로 숨깁니다. */
        WishAccountOrPhotoNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description CARD_BALANCE_ACCOUNT_NOT_FOUND 또는 WISH_NOT_FOUND — 계정이 없거나 인증된 학생이 소유하지 않은 경우, 또는 위시가 없거나 다른 소유자의 것이거나 해당 계정에 속하지 않은 경우입니다. 소유자가 논리 삭제한 위시는 이력 전용 응답에서 의도적으로 숨기지 않으며 200을 반환합니다. */
        WishHistoryOrAccountNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 위시 변경이 완료되었습니다. 동일 요청 재생은 최초 domain snapshot identity·상태·event identity·occurrence time·version을 유지합니다. 최초 사진 상태가 NO_PHOTO이면 이후 현재 attachment를 조회하거나 대체하지 않고 photo null을 반환합니다. ACTIVE_PHOTO이면 인증 학생 소유이고 최초 snapshot의 정확한 위시에 ATTACHED인 같은 photoId를 재검증한 뒤 새 5분 URL만 발급합니다. PHOTO_REVOKED이면 이 성공 응답 대신 409 WISH_PHOTO_EXPIRED를 반환하고, 유효한 ACTIVE_PHOTO의 URL 발급만 실패하면 이 성공 응답 대신 503 PHOTO_DELIVERY_UNAVAILABLE을 반환합니다. Idempotency-Replayed는 성공 재생에만 true이고, 사진 응답 capability는 state-changing command가 commit하기 전에 발급되어야 합니다. */
        WishMutationSuccess: {
            headers: {
                "Cache-Control": components["headers"]["CacheControlNoStore"];
                "Idempotency-Replayed": components["headers"]["IdempotencyReplayed"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["WishMutationResult"];
            };
        };
        /** @description CARD_BALANCE_ACCOUNT_NOT_FOUND 또는 WISH_NOT_FOUND — 리소스 부재, 비소유, 삭제, 그 밖의 숨김 상태를 나타냅니다. */
        WishOrAccountNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description WISH_PHOTO_ALREADY_ATTACHED — 사진이 이미 어떤 위시에 첨부되어 Pending 취소 또는 다른 위시 첨부에 사용할 수 없습니다. */
        WishPhotoAlreadyAttached: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description WISH_PHOTO_NOT_FOUND — 사진이 없거나 인증된 학생과 다른 소유자임을 구분하지 않습니다. */
        WishPhotoNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description IDEMPOTENCY_KEY_REUSED — 보존 중인 같은 소유자·Idempotency-Key receipt의 콘텐츠 digest가 다르며 변환·안전성 검사·quota 소비·객체 쓰기 전에 실패합니다. WISH_PHOTO_EXPIRED — 보존 중인 receipt의 digest는 같지만 성공 사진이 Pending 취소·만료, 교체·명시적 제거, Wish 삭제, DELETE_PENDING 전환 또는 hard cleanup으로 재생 불가능합니다. 두 응답 모두 retryable false이며 사진, photoId, URL, object path, digest, receipt outcome, retainUntil을 노출하지 않습니다. */
        WishPhotoUploadConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, INSUFFICIENT_WISH_AMOUNT, IDEMPOTENCY_KEY_REUSED 또는 WISH_PHOTO_EXPIRED. 일치하는 성공 receipt의 사진 상태가 PHOTO_REVOKED이면 Wish 성공 본문과 photo capability 없이 WISH_PHOTO_EXPIRED입니다. */
        WithdrawalConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
    };
    parameters: {
        AcademyId: components["schemas"]["Uuid"];
        CardBalanceAccountId: components["schemas"]["Uuid"];
        /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
        Cursor: components["schemas"]["Cursor"];
        /** @description 학생별 영구 네임스페이스입니다. 동일한 작업, 대상, 정규화된 요청에만 키를 재사용할 수 있습니다. */
        IdempotencyKey: string;
        /** @description 본문 없는 DELETE의 동시성 검사를 위한 정확한 음수 아닌 정수 위시 버전입니다. 값이 없거나 정수가 아니면 400, 디코딩된 값이 음수이면 422 INVALID_VERSION, 음수가 아니지만 최신 버전과 다르면 409 VERSION_CONFLICT를 반환합니다. */
        IfMatch: components["schemas"]["WishVersion"];
        Limit: number;
        /** @description 앞뒤의 유니코드 Space_Separator 코드 포인트를 반복해서 제거하고 NFC로 정규화한 뒤, Cc, Cf, Zl, Zp를 거부하며 1~80개의 유니코드 코드 포인트를 요구합니다. 저장된 NFC 정규화 닉네임에서 대소문자를 구분하는 연속 유니코드 코드 포인트 부분 문자열로 일치 여부를 판단합니다. */
        NicknameSearch: string;
        /** @description 생략하면 닉네임 필터를 적용하지 않습니다. 제공하면 앞뒤의 유니코드 Space_Separator 코드 포인트를 반복해서 제거하고 NFC로 정규화한 뒤, Cc, Cf, Zl, Zp를 거부하며 1~80개의 유니코드 코드 포인트를 요구합니다. 저장된 NFC 정규화 닉네임에서 대소문자를 구분하는 연속 유니코드 코드 포인트 부분 문자열로 일치 여부를 판단합니다. 빈 값 또는 공백만 있는 값은 400 MALFORMED_REQUEST입니다. 요청한 팔로잉·팔로워 목록 안에서만 검색합니다. */
        OptionalRelationshipNickname: string;
        SharedCardId: components["schemas"]["Uuid"];
        /** @description 공개 카드 작성 학생의 안정적인 UUID입니다. 생략하면 본인 카드를 제외하고 명시하면 해당 작성자로 제한하며 자기 ID도 허용합니다. 빈 문자열, null 문자열, 잘못된 UUID는 400 MALFORMED_REQUEST입니다. */
        SharedCardOwnerId: components["schemas"]["Uuid"];
        /** @description 관계 상대방의 UUID입니다. 인증된 소유자 정보는 항상 현재 인증 주체에서 가져오며 이 매개변수로 받지 않습니다. */
        StudentId: components["schemas"]["Uuid"];
        WishId: components["schemas"]["Uuid"];
        /** @description Opaque 위시 사진 UUID입니다. 식별자 knowledge만으로 읽기, 취소 또는 첨부 권한이 생기지 않습니다. */
        WishPhotoId: components["schemas"]["Uuid"];
    };
    requestBodies: never;
    headers: {
        /** @description 짧은 수명의 비공개 signed URL이 포함될 수 있으므로 JSON 응답을 저장하지 않습니다. */
        CacheControlNoStore: "no-store";
        /** @description 동일한 요청의 종결 성공 domain 결과가 재생되는 경우에만 true입니다. ACTIVE_PHOTO는 최초 결과의 정확한 photoId만 유지하고 ephemeral signed URL을 새로 발급하며, NO_PHOTO는 이후 현재 attachment와 무관하게 null을 유지합니다. PHOTO_REVOKED의 409 WISH_PHOTO_EXPIRED 또는 URL 발급 실패의 503 PHOTO_DELIVERY_UNAVAILABLE에는 이 header를 보내지 않습니다. */
        IdempotencyReplayed: boolean;
        /** @description 가장 이른 적용 quota 해제까지 기다릴 양의 정수 초입니다. */
        RetryAfter: number;
    };
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getFeedBehaviorMetrics: {
        parameters: {
            query: {
                /** @description 서울 기준 포함 시작일입니다. */
                fromDate: components["schemas"]["UtcDate"];
                /** @description 서울 기준 제외 종료일입니다. 최대 90일의 양의 기간이며 서울 기준 내일까지 허용합니다. */
                toDate: components["schemas"]["UtcDate"];
            };
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 수집 범위를 명시한 관측 집계입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BehaviorFeedMetrics"];
                };
            };
            /** @description 날짜·기간 또는 요청 구조가 잘못되었습니다. */
            400: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 머신 Bearer 인증이 필요합니다. */
            401: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    /** @description Bearer 인증을 요구합니다. */
                    "WWW-Authenticate": "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 현재 조회 가능한 학원 또는 학생이 없습니다. */
            404: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    getOutgoingAuthorInterestMetrics: {
        parameters: {
            query: {
                /** @description 서울 기준 포함 시작일입니다. */
                fromDate: components["schemas"]["UtcDate"];
                /** @description 서울 기준 제외 종료일입니다. 최대 90일의 양의 기간이며 서울 기준 내일까지 허용합니다. */
                toDate: components["schemas"]["UtcDate"];
            };
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 방문 대상 작성자 UUID입니다. */
                authorStudentId: components["schemas"]["Uuid"];
                /** @description 집계 기준 학생 UUID입니다. */
                studentId: components["schemas"]["Uuid"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 수집 범위를 명시한 관측 집계입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BehaviorAuthorInterestMetrics"];
                };
            };
            /** @description 날짜·기간 또는 요청 구조가 잘못되었습니다. */
            400: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 머신 Bearer 인증이 필요합니다. */
            401: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    /** @description Bearer 인증을 요구합니다. */
                    "WWW-Authenticate": "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 현재 조회 가능한 학원 또는 학생이 없습니다. */
            404: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    getIncomingProfileVisitMetrics: {
        parameters: {
            query: {
                /** @description 서울 기준 포함 시작일입니다. */
                fromDate: components["schemas"]["UtcDate"];
                /** @description 서울 기준 제외 종료일입니다. 최대 90일의 양의 기간이며 서울 기준 내일까지 허용합니다. */
                toDate: components["schemas"]["UtcDate"];
            };
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 집계 기준 학생 UUID입니다. */
                studentId: components["schemas"]["Uuid"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 수집 범위를 명시한 관측 집계입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BehaviorProfileVisitMetrics"];
                };
            };
            /** @description 날짜·기간 또는 요청 구조가 잘못되었습니다. */
            400: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 머신 Bearer 인증이 필요합니다. */
            401: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    /** @description Bearer 인증을 요구합니다. */
                    "WWW-Authenticate": "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 현재 조회 가능한 학원 또는 학생이 없습니다. */
            404: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    createFeedEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BehaviorFeedEventRequest"];
            };
        };
        responses: {
            /** @description 현재 접근을 확인한 보존 이벤트의 동일 재생입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    /** @description 현재 접근을 확인한 동일 이벤트 재생에만 true입니다. */
                    "Idempotency-Replayed": true;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BehaviorEventAccepted"];
                };
            };
            /** @description 새 요청을 저장한 결과입니다. */
            201: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BehaviorEventAccepted"];
                };
            };
            /** @description 요청 실패: MALFORMED_REQUEST, EVENT_TIME_OUT_OF_RANGE */
            400: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: AUTH_REQUIRED */
            401: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    /** @description Bearer 인증을 요구합니다. */
                    "WWW-Authenticate": "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: FORBIDDEN */
            403: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: ACADEMY_NOT_FOUND, FEED_CONTEXT_NOT_FOUND, SHARED_CARD_NOT_FOUND */
            404: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: EVENT_ID_CONFLICT, IMPRESSION_CONFLICT, IMPRESSION_ALREADY_EXPOSED */
            409: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: FEED_CONTEXT_EXPIRED */
            410: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    createFeedResult: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FeedResultRequest"];
            };
        };
        responses: {
            /** @description 새 요청을 저장한 결과입니다. */
            201: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedResultResponse"];
                };
            };
            /** @description 요청 실패: MALFORMED_REQUEST */
            400: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: AUTH_REQUIRED */
            401: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    /** @description Bearer 인증을 요구합니다. */
                    "WWW-Authenticate": "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: FORBIDDEN */
            403: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: ACADEMY_NOT_FOUND */
            404: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: PHOTO_DELIVERY_UNAVAILABLE */
            503: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    listAcademyFollowers: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
                /** @description 생략하면 닉네임 필터를 적용하지 않습니다. 제공하면 앞뒤의 유니코드 Space_Separator 코드 포인트를 반복해서 제거하고 NFC로 정규화한 뒤, Cc, Cf, Zl, Zp를 거부하며 1~80개의 유니코드 코드 포인트를 요구합니다. 저장된 NFC 정규화 닉네임에서 대소문자를 구분하는 연속 유니코드 코드 포인트 부분 문자열로 일치 여부를 판단합니다. 빈 값 또는 공백만 있는 값은 400 MALFORMED_REQUEST입니다. 요청한 팔로잉·팔로워 목록 안에서만 검색합니다. */
                nickname?: components["parameters"]["OptionalRelationshipNickname"];
            };
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 학원의 팔로워 검색 결과와 전체 관계 수입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FollowPage"];
                };
            };
            400: components["responses"]["StudentRelationshipMalformedRequest"];
            401: components["responses"]["StudentRelationshipAuthRequired"];
            403: components["responses"]["StudentRelationshipForbidden"];
            404: components["responses"]["StudentRelationshipAcademyNotFound"];
        };
    };
    listAcademyFollowing: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
                /** @description 생략하면 닉네임 필터를 적용하지 않습니다. 제공하면 앞뒤의 유니코드 Space_Separator 코드 포인트를 반복해서 제거하고 NFC로 정규화한 뒤, Cc, Cf, Zl, Zp를 거부하며 1~80개의 유니코드 코드 포인트를 요구합니다. 저장된 NFC 정규화 닉네임에서 대소문자를 구분하는 연속 유니코드 코드 포인트 부분 문자열로 일치 여부를 판단합니다. 빈 값 또는 공백만 있는 값은 400 MALFORMED_REQUEST입니다. 요청한 팔로잉·팔로워 목록 안에서만 검색합니다. */
                nickname?: components["parameters"]["OptionalRelationshipNickname"];
            };
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 학원의 팔로잉 검색 결과와 전체 관계 수입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FollowPage"];
                };
            };
            400: components["responses"]["StudentRelationshipMalformedRequest"];
            401: components["responses"]["StudentRelationshipAuthRequired"];
            403: components["responses"]["StudentRelationshipForbidden"];
            404: components["responses"]["StudentRelationshipAcademyNotFound"];
        };
    };
    followAcademyStudent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 관계 상대방의 UUID입니다. 인증된 소유자 정보는 항상 현재 인증 주체에서 가져오며 이 매개변수로 받지 않습니다. */
                studentId: components["parameters"]["StudentId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 요청한 현재 상태입니다. 응답 본문이 없습니다. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["StudentRelationshipMalformedRequest"];
            401: components["responses"]["StudentRelationshipAuthRequired"];
            403: components["responses"]["StudentRelationshipForbidden"];
            404: components["responses"]["StudentOrAcademyNotFound"];
            409: components["responses"]["SelfRelationshipConflict"];
        };
    };
    unfollowAcademyStudent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 관계 상대방의 UUID입니다. 인증된 소유자 정보는 항상 현재 인증 주체에서 가져오며 이 매개변수로 받지 않습니다. */
                studentId: components["parameters"]["StudentId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 요청한 현재 상태입니다. 응답 본문이 없습니다. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["StudentRelationshipMalformedRequest"];
            401: components["responses"]["StudentRelationshipAuthRequired"];
            403: components["responses"]["StudentRelationshipForbidden"];
            404: components["responses"]["StudentOrAcademyNotFound"];
            409: components["responses"]["SelfRelationshipConflict"];
        };
    };
    createProfileVisit: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BehaviorProfileVisitRequest"];
            };
        };
        responses: {
            /** @description 현재 접근을 확인한 보존 이벤트의 동일 재생입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    /** @description 현재 접근을 확인한 동일 이벤트 재생에만 true입니다. */
                    "Idempotency-Replayed": true;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BehaviorEventAccepted"];
                };
            };
            /** @description 새 요청을 저장한 결과입니다. */
            201: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BehaviorEventAccepted"];
                };
            };
            /** @description 요청 실패: MALFORMED_REQUEST, SELF_PROFILE_VISIT, EVENT_TIME_OUT_OF_RANGE */
            400: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: AUTH_REQUIRED */
            401: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    /** @description Bearer 인증을 요구합니다. */
                    "WWW-Authenticate": "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: FORBIDDEN */
            403: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: ACADEMY_NOT_FOUND, PROFILE_NOT_FOUND */
            404: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: EVENT_ID_CONFLICT */
            409: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description 요청 실패: UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    listAcademySharedCards: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
                /** @description 공개 카드 작성 학생의 안정적인 UUID입니다. 생략하면 본인 카드를 제외하고 명시하면 해당 작성자로 제한하며 자기 ID도 허용합니다. 빈 문자열, null 문자열, 잘못된 UUID는 400 MALFORMED_REQUEST입니다. */
                ownerId?: components["parameters"]["SharedCardOwnerId"];
            };
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 조회 가능한 진행 카드, 완료 카드, 포기 카드입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SharedCardPage"];
                };
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["AcademyNotFound"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    getAcademySharedCard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                cardId: components["parameters"]["SharedCardId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 조회 가능한 진행 카드, 완료 카드 또는 포기 카드 한 건입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SharedCard"];
                };
            };
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["SharedCardOrAcademyNotFound"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    searchAcademyStudents: {
        parameters: {
            query: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
                /** @description 앞뒤의 유니코드 Space_Separator 코드 포인트를 반복해서 제거하고 NFC로 정규화한 뒤, Cc, Cf, Zl, Zp를 거부하며 1~80개의 유니코드 코드 포인트를 요구합니다. 저장된 NFC 정규화 닉네임에서 대소문자를 구분하는 연속 유니코드 코드 포인트 부분 문자열로 일치 여부를 판단합니다. */
                nickname: components["parameters"]["NicknameSearch"];
            };
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 같은 학원에 속한 학생 검색 결과와 각 학생의 관계 상태입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentRelationshipPage"];
                };
            };
            400: components["responses"]["StudentRelationshipMalformedRequest"];
            401: components["responses"]["StudentRelationshipAuthRequired"];
            403: components["responses"]["StudentRelationshipForbidden"];
            404: components["responses"]["StudentRelationshipAcademyNotFound"];
        };
    };
    getAcademyStudent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 관계 상대방의 UUID입니다. 인증된 소유자 정보는 항상 현재 인증 주체에서 가져오며 이 매개변수로 받지 않습니다. */
                studentId: components["parameters"]["StudentId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 대상 학생의 안정적인 신원과 현재 양방향 팔로우 상태입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentRelationship"];
                };
            };
            400: components["responses"]["StudentRelationshipMalformedRequest"];
            401: components["responses"]["StudentRelationshipAuthRequired"];
            403: components["responses"]["StudentRelationshipForbidden"];
            404: components["responses"]["StudentOrAcademyNotFound"];
        };
    };
    getCardBalanceAccount: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 저장된 카드 잔액 계정 프로젝션입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CardBalanceAccount"];
                };
            };
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["CardBalanceAccountNotFound"];
        };
    };
    refreshCardBalance: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 성공적인 현재 잔액 관측입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BalanceRefreshResult"];
                };
            };
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["CardBalanceAccountNotFound"];
            503: components["responses"]["BalanceSyncFailed"];
        };
    };
    listCardBalanceChanges: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
            };
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 0이 아닌 불변의 카드 잔액 이벤트 내역입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CardBalanceChangePage"];
                };
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["CardBalanceAccountNotFound"];
        };
    };
    listAccountFundMovements: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
            };
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 계정 자금 이동 내역입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountFundMovementPage"];
                };
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["CardBalanceAccountNotFound"];
        };
    };
    getMonthlyRecap: {
        parameters: {
            query?: {
                /** @description 조회할 완료 월의 Asia/Seoul YYYY-MM 값입니다. 생략하면 가장 최근 완료 월을 선택합니다. */
                month?: string;
            };
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 선택한 완료 월의 현재 공개 리캡 상태와 불변 결과입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MonthlyRecapResponse"];
                };
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["CardBalanceAccountNotFound"];
            503: components["responses"]["RecapQueryUnavailable"];
        };
    };
    getWeeklyRecap: {
        parameters: {
            query?: {
                /** @description 조회할 완료 주의 Asia/Seoul 월요일 시작일입니다. 생략하면 가장 최근 완료 주를 선택합니다. */
                weekStart?: string;
            };
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 선택한 완료 주의 현재 공개 리캡 상태와 불변 결과입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WeeklyRecapResponse"];
                };
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["CardBalanceAccountNotFound"];
            503: components["responses"]["RecapQueryUnavailable"];
        };
    };
    getRepresentativeWish: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 대표 위시입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Wish"];
                };
            };
            /** @description 유효한 계정에 현재 대표 위시가 없습니다. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["CardBalanceAccountNotFound"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    selectRepresentativeWish: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RepresentativeWishSelectionRequest"];
            };
        };
        responses: {
            /** @description 선택된 대표 위시는 변경 결과 래퍼나 eventId 없이 직접 반환됩니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Wish"];
                };
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishOrAccountNotFound"];
            409: components["responses"]["RepresentativeWishSelectionConflict"];
            415: components["responses"]["JsonUnsupportedMediaType"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    transferWishFunds: {
        parameters: {
            query?: never;
            header: {
                /** @description 학생별 영구 네임스페이스입니다. 동일한 작업, 대상, 정규화된 요청에만 키를 재사용할 수 있습니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WishTransferRequest"];
            };
        };
        responses: {
            /** @description 원자적 이체가 완료되었습니다. 동일 요청 재생은 출발·도착의 최초 domain 결과와 각 ACTIVE_PHOTO의 정확한 photoId 또는 NO_PHOTO의 null을 유지하고, 양쪽을 모두 검증한 뒤 ephemeral photo URL만 새로 발급합니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    "Idempotency-Replayed": components["headers"]["IdempotencyReplayed"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WishTransferResult"];
                };
            };
            400: components["responses"]["MalformedOrIdempotencyRequired"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishOrAccountNotFound"];
            409: components["responses"]["TransferConflict"];
            422: components["responses"]["InvalidTransferAmountOrVersion"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    listWishes: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
                state?: components["schemas"]["WishState"][];
            };
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 삭제되지 않은 위시 페이지입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WishPage"];
                };
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["CardBalanceAccountNotFound"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    createWish: {
        parameters: {
            query?: never;
            header: {
                /** @description 학생별 영구 네임스페이스입니다. 동일한 작업, 대상, 정규화된 요청에만 키를 재사용할 수 있습니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateWishRequest"];
            };
        };
        responses: {
            /** @description 위시가 생성되었습니다. 동일 요청 재생은 최초 domain 결과와 ACTIVE_PHOTO의 정확한 photoId 또는 NO_PHOTO의 null을 유지하고, 유효한 ACTIVE_PHOTO의 ephemeral URL만 새로 발급합니다. */
            201: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    "Idempotency-Replayed": components["headers"]["IdempotencyReplayed"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WishMutationResult"];
                };
            };
            400: components["responses"]["MalformedOrIdempotencyRequired"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["CreateWishResourceNotFound"];
            409: components["responses"]["CreateConflict"];
            /** @description UNSUPPORTED_MEDIA_TYPE — Content-Type이 application/json이 아닙니다. */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            422: components["responses"]["InvalidAmountOrPurpose"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    getWish: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 위시입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Wish"];
                };
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishOrAccountNotFound"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    deleteWish: {
        parameters: {
            query?: never;
            header: {
                /** @description 학생별 영구 네임스페이스입니다. 동일한 작업, 대상, 정규화된 요청에만 키를 재사용할 수 있습니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description 본문 없는 DELETE의 동시성 검사를 위한 정확한 음수 아닌 정수 위시 버전입니다. 값이 없거나 정수가 아니면 400, 디코딩된 값이 음수이면 422 INVALID_VERSION, 음수가 아니지만 최신 버전과 다르면 409 VERSION_CONFLICT를 반환합니다. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["WishMutationSuccess"];
            400: components["responses"]["DeletePreconditionRequired"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishOrAccountNotFound"];
            409: components["responses"]["DeleteConflict"];
            422: components["responses"]["InvalidIfMatchVersion"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    patchWish: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/merge-patch+json": components["schemas"]["WishMergePatch"];
            };
        };
        responses: {
            /** @description 원자적으로 갱신된 위시입니다. */
            200: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WishMutationResult"];
                };
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishAccountOrPhotoNotFound"];
            409: components["responses"]["PatchConflict"];
            415: components["responses"]["UnsupportedMediaType"];
            422: components["responses"]["InvalidAmountPurposeOrVersion"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    abandonWish: {
        parameters: {
            query?: never;
            header: {
                /** @description 학생별 영구 네임스페이스입니다. 동일한 작업, 대상, 정규화된 요청에만 키를 재사용할 수 있습니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WishVersionCommand"];
            };
        };
        responses: {
            200: components["responses"]["WishMutationSuccess"];
            400: components["responses"]["MalformedOrIdempotencyRequired"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishOrAccountNotFound"];
            409: components["responses"]["StateMutationConflict"];
            /** @description UNSUPPORTED_MEDIA_TYPE — Content-Type이 application/json이 아닙니다. */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            422: components["responses"]["InvalidVersion"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    completeWish: {
        parameters: {
            query?: never;
            header: {
                /** @description 학생별 영구 네임스페이스입니다. 동일한 작업, 대상, 정규화된 요청에만 키를 재사용할 수 있습니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WishVersionCommand"];
            };
        };
        responses: {
            200: components["responses"]["WishMutationSuccess"];
            400: components["responses"]["MalformedOrIdempotencyRequired"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishOrAccountNotFound"];
            409: components["responses"]["StateMutationConflict"];
            /** @description UNSUPPORTED_MEDIA_TYPE — Content-Type이 application/json이 아닙니다. */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            422: components["responses"]["InvalidVersion"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    depositToWish: {
        parameters: {
            query?: never;
            header: {
                /** @description 학생별 영구 네임스페이스입니다. 동일한 작업, 대상, 정규화된 요청에만 키를 재사용할 수 있습니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WishAmountCommand"];
            };
        };
        responses: {
            200: components["responses"]["WishMutationSuccess"];
            400: components["responses"]["MalformedOrIdempotencyRequired"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishOrAccountNotFound"];
            409: components["responses"]["DepositConflict"];
            422: components["responses"]["InvalidAmountOrVersion"];
            503: components["responses"]["BalanceSyncOrPhotoDeliveryUnavailable"];
        };
    };
    listWishFundMovements: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
            };
            header?: never;
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 위시 자금 이동 이력입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WishFundMovementPage"];
                };
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishHistoryOrAccountNotFound"];
        };
    };
    withdrawFromWish: {
        parameters: {
            query?: never;
            header: {
                /** @description 학생별 영구 네임스페이스입니다. 동일한 작업, 대상, 정규화된 요청에만 키를 재사용할 수 있습니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
                wishId: components["parameters"]["WishId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WishAmountCommand"];
            };
        };
        responses: {
            200: components["responses"]["WishMutationSuccess"];
            400: components["responses"]["MalformedOrIdempotencyRequired"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishOrAccountNotFound"];
            409: components["responses"]["WithdrawalConflict"];
            422: components["responses"]["InvalidAmountOrVersion"];
            503: components["responses"]["PhotoDeliveryUnavailable"];
        };
    };
    listMyCardBalanceAccounts: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 조회 가능한 카드 잔액 계정입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CardBalanceAccountPage"];
                };
            };
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
        };
    };
    listMyStudentBlocks: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 인증된 학생이 생성한 활성 블록입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentBlockPage"];
                };
            };
            400: components["responses"]["StudentRelationshipMalformedRequest"];
            401: components["responses"]["StudentRelationshipAuthRequired"];
            403: components["responses"]["StudentRelationshipForbidden"];
        };
    };
    blockStudent: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudentBlockRequest"];
            };
        };
        responses: {
            /** @description 단방향 전역 차단이 생성되거나 다시 생성되었습니다. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentBlock"];
                };
            };
            400: components["responses"]["StudentRelationshipMalformedRequest"];
            401: components["responses"]["StudentRelationshipAuthRequired"];
            403: components["responses"]["StudentRelationshipForbidden"];
            404: components["responses"]["StudentNotFound"];
            409: components["responses"]["StudentBlockConflict"];
        };
    };
    unblockStudent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 관계 상대방의 UUID입니다. 인증된 소유자 정보는 항상 현재 인증 주체에서 가져오며 이 매개변수로 받지 않습니다. */
                studentId: components["parameters"]["StudentId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 블록이 해제되었습니다. 응답에는 본문이 없습니다. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["StudentRelationshipMalformedRequest"];
            401: components["responses"]["StudentRelationshipAuthRequired"];
            403: components["responses"]["StudentRelationshipForbidden"];
            404: components["responses"]["StudentBlockNotFound"];
        };
    };
    uploadWishPhoto: {
        parameters: {
            query?: never;
            header: {
                /** @description 학생별 영구 네임스페이스입니다. 동일한 작업, 대상, 정규화된 요청에만 키를 재사용할 수 있습니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["WishPhotoUploadRequest"];
            };
        };
        responses: {
            /** @description 검증·안전성 검사·비공개 변형 저장이 완료된 미첨부 Pending 사진입니다. 멱등 재생은 같은 사진 identity에 새 5분 signed URL을 발급합니다. */
            201: {
                headers: {
                    "Cache-Control": components["headers"]["CacheControlNoStore"];
                    "Idempotency-Replayed": components["headers"]["IdempotencyReplayed"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WishPhoto"];
                };
            };
            400: components["responses"]["MalformedOrIdempotencyRequired"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            409: components["responses"]["WishPhotoUploadConflict"];
            413: components["responses"]["PhotoTooLarge"];
            415: components["responses"]["UnsupportedPhotoType"];
            422: components["responses"]["InvalidOrRejectedPhoto"];
            429: components["responses"]["PhotoUploadRateLimited"];
            503: components["responses"]["PhotoUploadUnavailable"];
        };
    };
    deletePendingWishPhoto: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Opaque 위시 사진 UUID입니다. 식별자 knowledge만으로 읽기, 취소 또는 첨부 권한이 생기지 않습니다. */
                photoId: components["parameters"]["WishPhotoId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 사진이 즉시 첨부 불가능해졌거나 이미 같은 소유자의 DELETE_PENDING 상태입니다. 응답 본문은 없습니다. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishPhotoNotFound"];
            409: components["responses"]["WishPhotoAlreadyAttached"];
        };
    };
}
