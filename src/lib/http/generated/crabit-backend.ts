export interface paths {
    "/v1/academies/{academyId}/friend-requests": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 친구 요청 보내기
         * @description 현재 인증 주체의 subjectId를 발신자로 하여 같은 학원의 현재 학생에게 PENDING 요청 하나를 생성합니다. 클라이언트 입력으로 발신자를 지정할 수 없습니다. 정규 학생 쌍 잠금 아래에서 어느 방향이든 활성 차단이 있으면 STUDENT_NOT_FOUND로 숨깁니다. 자기 자신, 현재 친구 관계, 같은 방향의 PENDING 요청, 반대 방향의 PENDING 요청은 각각 문서화된 충돌을 반환합니다. Idempotency-Key는 받지 않으며 재요청도 현재 상태를 기준으로 평가합니다.
         */
        post: operations["sendFriendRequest"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/friend-requests/{friendRequestId}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 친구 요청의 UUID입니다. 승인되지 않았거나 잘못된 역할 식별자는 FRIEND_REQUEST_NOT_FOUND로 정규화됩니다. */
                friendRequestId: components["parameters"]["FriendRequestId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * 보낸 대기 중 친구 요청 취소
         * @description 보낸 사람으로서 인증된 학생이 소유한 PENDING 요청만 취소합니다. 보낸 사람이 소유하지 않거나 승인되지 않은 학원 외부 요청은 FRIEND_REQUEST_NOT_FOUND로 숨겨집니다. 처리된 소유 요청은 FRIEND_REQUEST_NOT_PENDING를 반환합니다.
         */
        delete: operations["cancelFriendRequest"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/friend-requests/{friendRequestId}/acceptance": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 친구 요청의 UUID입니다. 승인되지 않았거나 잘못된 역할 식별자는 FRIEND_REQUEST_NOT_FOUND로 정규화됩니다. */
                friendRequestId: components["parameters"]["FriendRequestId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 받은 대기 중 친구 요청 수락
         * @description 인증된 학생이 수신자로 소유한 PENDING 요청만 수락합니다. 정규 학생 쌍 잠금 아래에서 현재 학원 소속, 정확한 요청, 현재 친구 관계가 없음, 양방향 차단이 없음을 다시 확인합니다. 한 트랜잭션에서 요청을 ACCEPTED로 바꾸고 현재 친구 관계를 정확히 하나 생성하거나 재개합니다. 동시성 경쟁에서 실패한 요청은 문서화된 충돌을 반환합니다.
         */
        post: operations["acceptFriendRequest"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/friend-requests/{friendRequestId}/rejection": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 친구 요청의 UUID입니다. 승인되지 않았거나 잘못된 역할 식별자는 FRIEND_REQUEST_NOT_FOUND로 정규화됩니다. */
                friendRequestId: components["parameters"]["FriendRequestId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 받은 대기 중 친구 요청 거절
         * @description 인증된 학생이 수신자로 소유한 PENDING 요청만 거부합니다. 수신자 소유가 아닌 학원 외부 요청 또는 승인되지 않은 요청은 FRIEND_REQUEST_NOT_FOUND로 숨겨집니다. 처리된 소유 요청은 FRIEND_REQUEST_NOT_PENDING를 반환합니다.
         */
        post: operations["rejectFriendRequest"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/friend-requests/received": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        /**
         * 받은 대기 중 친구 요청 목록 조회
         * @description 인증된 학생이 수신자인 현재 PENDING 요청만 반환합니다. 결과는 createdAt DESC, friendRequestId DESC 순으로 정렬합니다. 불투명 커서는 이 작업, 인증된 학생, 학원, 정렬 버전, 마지막 튜플에 바인딩됩니다. 형식이 잘못되었거나 바인딩이 일치하지 않는 커서는 부분 페이지 없이 400을 반환합니다. 다음 페이지는 마지막 튜플보다 엄격히 뒤에 이어지며 유효한 커서에는 유효한 limit 값을 함께 사용할 수 있습니다.
         */
        get: operations["listReceivedFriendRequests"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/friend-requests/sent": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        /**
         * 보낸 대기 중 친구 요청 목록 조회
         * @description 인증된 학생이 발신자인 현재 PENDING 요청만 반환합니다. 결과는 createdAt DESC, friendRequestId DESC 순으로 정렬합니다. 불투명 커서는 이 작업, 인증된 학생, 학원, 정렬 버전, 마지막 튜플에 바인딩됩니다. 형식이 잘못되었거나 바인딩이 일치하지 않는 커서는 부분 페이지 없이 400을 반환합니다. 다음 페이지는 마지막 튜플보다 엄격히 뒤에 이어지며 유효한 커서에는 유효한 limit 값을 함께 사용할 수 있습니다.
         */
        get: operations["listSentFriendRequests"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/friends": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        /**
         * 현재 같은 학원 친구 목록 조회
         * @description 상대방이 요청한 학원의 현재 회원인 인증된 학생의 현재 정식 친구 관계를 나열합니다. 결과는 friendsSince DESC, studentId DESC 순으로 정렬됩니다. 불투명 커서는 이 작업, 인증된 학생, 학원, 정렬 버전 및 최종 튜플에 바인딩됩니다. 형식이 잘못되었거나 일치하지 않는 커서는 부분 페이지 없이 400을 반환합니다. 연속은 엄격하게 최종 튜플 아래에 있으며 유효한 커서와 함께 유효한 제한을 사용할 수 있습니다.
         */
        get: operations["listAcademyFriends"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/academies/{academyId}/friends/{studentId}": {
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
        put?: never;
        post?: never;
        /**
         * 현재 같은 학원 친구 관계 종료
         * @description 인증된 학생과 요청한 학원의 대상 학생 사이에 현재 맺어진 친구 관계를 종료합니다. 관계가 없거나 이미 종료되었거나, 학원 구성원이 아니거나, 인증된 학생이 당사자가 아닌 경우는 FRIENDSHIP_NOT_FOUND로 숨깁니다. 이 작업은 과거 친구 요청을 다시 활성화하지 않으며 성공 응답 본문이 없습니다.
         */
        delete: operations["unfriendAcademyStudent"];
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
         * @description 조회할 때마다 학원 소속, 친구 관계, 양방향 차단을 다시 평가하고 소유자 본인은 제외합니다. PRIVATE 위시는 카드를 생성하지 않습니다. 임시 정렬은 contentUpdatedAt DESC, sharedCardId DESC 순입니다. 현재는 정렬 매개변수를 지원하지 않습니다. 이 임시 정책에서는 콘텐츠 또는 게시 상태가 바뀔 때만 카드 순서가 달라집니다. 친구 우선순위와 임베딩 기반 추천 정렬은 향후 계약에서 정할 사항이며 이 버전에서는 사용하지 않습니다.
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
         * @description 소유자는 자신의 카드가 현재 공개 상태라면 조회할 수 있습니다. 그 밖의 리소스 부재나 공개 범위 조건 위반은 모두 숨깁니다.
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
         * @description 저장된 NFC 정규화 닉네임을 대상으로 대소문자를 구분하는 연속 유니코드 코드 포인트 부분 문자열을 검색해 인증된 학생과 같은 학원의 현재 구성원을 찾습니다. 인증된 학생 본인, 현재 구성원이 아닌 학생, 어느 방향으로든 활성 차단이 있는 후보는 제외합니다. 각 결과에는 NONE, FRIEND, OUTGOING_PENDING, INCOMING_PENDING 중 정확히 하나의 현재 관계 상태를 계산합니다. 결과는 nickname ASC, studentId ASC 순으로 정렬합니다. 불투명 커서는 이 작업, 인증된 학생, 학원, 정렬 버전, 정규화된 닉네임 필터, 마지막 정렬 튜플에 바인딩됩니다. 형식이 잘못되었거나 작업·행위자·학원이 다르거나 필터가 일치하지 않는 커서는 부분 페이지 없이 400을 반환합니다. 다음 페이지는 마지막 튜플 직후부터 이어지며 유효한 커서에는 유효한 limit 값을 함께 사용할 수 있습니다.
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
        /** 동일 계정의 두 위시 간 자금 원자적 이체 */
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
         * @description 불투명 커서를 사용하며 createdAt DESC, id DESC 순으로 정렬합니다. 각 위시는 카드 잔액 계정의 조회 시점 OPEN 잔액 조정 상태를 반환합니다.
         */
        get: operations["listWishes"];
        put?: never;
        /**
         * 초기 적립금이 0인 비공개 위시 생성
         * @description 잔액 정보가 UNKNOWN이거나 OPEN 잔액 불일치가 없을 때 amount 0, state IN_PROGRESS, visibility PRIVATE인 위시를 생성합니다. startDate와 targetDate는 각각 생략하거나 null로 지정할 수 있고, 둘 다 날짜이면 startDate가 targetDate보다 늦지 않아야 합니다. 역전된 날짜 범위는 새 멱등 기록이나 위시 변경을 만들기 전에 거부합니다. 새로 캡처하는 멱등 요청 식별에는 정규화된 startDate의 명시적 null 또는 ISO 달력 날짜가 포함되므로, 같은 Idempotency-Key를 다른 startDate와 사용하면 409 IDEMPOTENCY_KEY_REUSED입니다. 기능 도입 전에 성공한 키는 startDate가 null인 재시도만 이전 식별 방식으로 재생하며, 이전 스냅샷에 이 속성이 없어도 응답에는 startDate null을 명시합니다. 일치하는 Idempotency-Key의 이전 성공 결과는 현재 불일치 방어 조건보다 먼저 재생됩니다. 그 밖의 경우 OPEN 잔액 조정 건이 있으면 새 위시를 저장하기 전에 409 BALANCE_MISMATCH_LOCKED로 생성을 거부합니다.
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
         * @description 위시가 속한 카드 잔액 계정의 조회 시점 OPEN 잔액 조정 상태를 반환합니다. OPEN 잔액 조정 건이 있어도 이 조회를 차단하지 않습니다.
         */
        get: operations["getWish"];
        put?: never;
        post?: never;
        /**
         * 위시 논리 삭제
         * @description 최종 변경 결과를 반환합니다. 이후의 모든 조회는 WISH_NOT_FOUND로 숨깁니다. OPEN 잔액 조정 건이 있어도 삭제를 차단하지 않습니다.
         */
        delete: operations["deleteWish"];
        options?: never;
        head?: never;
        /**
         * 변경 가능한 위시 필드를 원자적으로 병합 패치
         * @description 필드를 생략하면 기존 값을 유지하고 startDate 또는 targetDate에 null을 지정하면 해당 날짜를 지웁니다. 두 날짜를 함께 변경할 때는 중간 상태가 아니라 원자적으로 적용한 최종 날짜 쌍을 검증하며, 둘 다 날짜이면 startDate가 targetDate보다 늦지 않아야 합니다. 성공한 날짜 변경은 updatedAt과 version을 정확히 한 번 갱신하고, 역전된 날짜 범위는 어떤 필드, version, updatedAt 또는 공유 카드도 변경하지 않습니다. 잔액 불일치가 없을 때 COMPLETED 또는 ABANDONED 위시는 공개 범위만 변경할 수 있습니다. 위시를 포기하면 공유 카드를 제거합니다. 포기된 위시의 공개 범위를 변경하면 소유자에게 보이는 위시 메타데이터만 갱신하고 공유 카드는 절대 생성하지 않습니다. OPEN 잔액 조정 건이 있으면 purpose, targetAmount, startDate, targetDate를 비롯해 공개 범위를 확대·축소하거나 PRIVATE로 바꾸는 모든 요청 필드를 거부합니다.
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
         * @description OPEN 잔액 조정 건이 있어도 포기를 차단하지 않습니다. 반환된 위시는 변경 커밋 후의 잔액 조정 플래그를 담습니다.
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
         * @description OPEN 잔액 조정 건이 있어도 완료를 차단하지 않습니다. 반환된 위시는 변경 커밋 후의 잔액 조정 플래그를 담습니다.
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
         * @description 내부에서 PRE_DEPOSIT 조회를 수행합니다. 외부 제공자 조회가 실패하면 위시는 변경되지 않습니다. 저장된 불일치 관측 결과는 이 입금 작업만 잠그고 거부합니다.
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
        /** 위시에서 자금 인출 */
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
         * @description 인증된 학생의 단방향 전역 차단을 생성하거나 다시 생성합니다. 클라이언트 입력으로 차단 주체를 지정할 수 없습니다. 정규 학생 쌍 잠금 아래에서 모든 학원의 현재 친구 관계를 종료하고, 모든 학원에서 양방향의 PENDING 요청을 processedAt이 설정된 CANCELED로 바꾸며, 같은 트랜잭션에서 차단을 활성화합니다. 재요청은 현재 상태를 기준으로 평가하며 Idempotency-Key는 받지 않습니다.
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
         * @description 차단 주체가 인증된 학생인 현재 차단만 해제합니다. 차단이 없거나 이미 해제되었거나 인증된 학생이 소유하지 않은 차단은 STUDENT_BLOCK_NOT_FOUND로 숨깁니다. 차단을 해제해도 친구 관계나 차단 과정에서 취소된 요청은 절대 복원하지 않으며 성공 응답 본문이 없습니다.
         */
        delete: operations["unblockStudent"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
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
             * @description createdAt부터 completedAt까지 경과한 음수 아닌 정수 초입니다.
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
            /** @description 소유자의 표시 별명입니다. 소유자 식별자, 학생 식별자, 계정 데이터 또는 실제 카드 데이터가 노출되지 않습니다. */
            ownerNickname: string;
            /**
             * @description 완료 카드 변형에서는 항상 100입니다.
             * @constant
             */
            progressPercent: 100;
            /** @description 게시된 NFC 정규화 위시 목적입니다. */
            purpose: components["schemas"]["Purpose"];
            /** @description 개인정보를 노출하지 않는 이 공유 카드 프로젝션의 안정적인 UUID입니다. 기반 위시 또는 계정 식별자는 노출하지 않습니다. */
            sharedCardId: components["schemas"]["Uuid"];
            /** @description 게시된 양의 정수 KRW 목표 금액입니다. 소유자의 정확한 과거 위시 잔액은 노출하지 않습니다. */
            targetAmount: components["schemas"]["KrwPositive"];
            /**
             * Format: date
             * @description 소유자가 선택적으로 지정한 목표 달력 날짜입니다. 완료된 위시에 목표 날짜가 없었으면 null입니다.
             */
            targetDate: string | null;
        };
        /** @description 수신자만 지정하는 요청 페이로드입니다. 발신자는 항상 현재 인증 주체의 subjectId에서 가져옵니다. */
        CreateFriendRequestRequest: {
            /** @description 친구 요청을 받을 같은 학원의 현재 학생 UUID입니다. */
            studentId: components["schemas"]["Uuid"];
        };
        /** @description 차단할 학생만 지정하는 요청 페이로드입니다. 차단 주체는 항상 현재 인증 주체의 subjectId에서 가져옵니다. */
        CreateStudentBlockRequest: {
            /** @description 전역적으로 차단할 학생의 UUID입니다. */
            studentId: components["schemas"]["Uuid"];
        };
        CreateWishRequest: {
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
        ErrorCode: "MALFORMED_REQUEST" | "EXPECTED_VERSION_REQUIRED" | "IDEMPOTENCY_KEY_REQUIRED" | "AUTH_REQUIRED" | "FORBIDDEN" | "CARD_BALANCE_ACCOUNT_NOT_FOUND" | "WISH_NOT_FOUND" | "ACADEMY_NOT_FOUND" | "SHARED_CARD_NOT_FOUND" | "VERSION_CONFLICT" | "INVALID_STATE_TRANSITION" | "BALANCE_MISMATCH_LOCKED" | "INSUFFICIENT_AVAILABLE_BALANCE" | "INSUFFICIENT_WISH_AMOUNT" | "TARGET_AMOUNT_EXCEEDED" | "CROSS_ACCOUNT_TRANSFER_FORBIDDEN" | "IDEMPOTENCY_KEY_REUSED" | "UNSUPPORTED_MEDIA_TYPE" | "INVALID_AMOUNT" | "INVALID_PURPOSE" | "INVALID_DATE_RANGE" | "INVALID_VERSION" | "BALANCE_SYNC_FAILED" | "STUDENT_NOT_FOUND" | "FRIENDSHIP_NOT_FOUND" | "FRIEND_REQUEST_NOT_FOUND" | "STUDENT_BLOCK_NOT_FOUND" | "SELF_RELATIONSHIP" | "ALREADY_FRIENDS" | "FRIEND_REQUEST_ALREADY_PENDING" | "INCOMING_FRIEND_REQUEST_PENDING" | "FRIEND_REQUEST_NOT_PENDING" | "FRIEND_REQUEST_NOT_ACTIONABLE" | "STUDENT_BLOCK_ALREADY_ACTIVE";
        ErrorEnvelope: {
            /** @description 선언된 모든 실패 JSON 응답이 공통으로 사용하는 구조화된 오류 페이로드입니다. */
            error: {
                /** @description 안정적으로 기계 판독할 수 있는 ErrorCode입니다. 클라이언트는 message 텍스트가 아니라 이 값으로 분기해야 합니다. */
                code: components["schemas"]["ErrorCode"];
                /** @description 오류 코드별로 확장할 수 있는 메타데이터 객체입니다. 적용할 세부 정보가 없으면 비어 있으며 클라이언트는 알 수 없는 키를 무시해야 합니다. */
                details: {
                    [key: string]: unknown;
                };
                /** @description 필드별 유효성 검사 실패 목록입니다. 오류 원인을 개별 요청 필드에 연결할 수 없으면 비어 있습니다. */
                fieldErrors: components["schemas"]["FieldError"][];
                /** @description 이번 오류 발생을 사람이 읽을 수 있게 설명한 문장입니다. 안정적인 기계 판정 키가 아닙니다. */
                message: string;
                /** @description BALANCE_SYNC_FAILED일 때만 true입니다. 정의된 모든 클라이언트, 인가, 리소스 없음, 유효성 검사, 상태 충돌 오류에는 false입니다. */
                retryable: boolean;
                /** @description 진단과 지원에 사용하는 불투명한 서버 상관관계 식별자입니다. 도메인 의미는 없습니다. */
                traceId: string;
            } & unknown;
        };
        FieldError: {
            /** @description 이 유효성 검사 실패와 관련된 잘못된 요청 필드, 매개 변수 또는 헤더의 이름입니다. */
            field: string;
            /** @description 해당 필드 오류를 사람이 읽을 수 있게 설명한 문장입니다. */
            message: string;
        };
        Friend: {
            /** @description 현재 친구 관계가 생성되거나 재개된 RFC 3339 UTC Z 시점입니다. */
            friendsSince: components["schemas"]["UtcInstant"];
            /** @description 현재 친구 닉네임이며 공백 문자열이 아닙니다. */
            nickname: string;
            /** @description 현재 친구의 안정적인 UUID입니다. */
            studentId: components["schemas"]["Uuid"];
        };
        FriendPage: {
            /** @description 현재 학원 친구는 friendsSince 내림차순, studentId 내림차순으로 정렬됩니다. */
            items: components["schemas"]["Friend"][];
            /** @description 최종 반환된 (friendsSince, studentId) 튜플에서 파생된 불투명 커서입니다. 더 이상 항목이 없으면 null입니다. */
            nextCursor: string | null;
        };
        /** @description 개인정보를 최소화한 친구 요청 프로젝션입니다. 상대방은 보낸 요청 결과에서는 수신자이고 받은 요청 결과에서는 발신자입니다. */
        FriendRequest: {
            /** @description 보낸 요청 결과에서는 수신자이고 받은 요청 결과에서는 발신자입니다. 별도의 소유권 식별자는 노출하지 않습니다. */
            counterpart: components["schemas"]["StudentSummary"];
            /** @description 이 요청이 생성된 RFC 3339 UTC Z 시점입니다. */
            createdAt: components["schemas"]["UtcInstant"];
            /** @description 이 친구 요청의 안정적인 UUID입니다. */
            friendRequestId: components["schemas"]["Uuid"];
            /** @description ACCEPTED, REJECTED, CANCELED 상태로 처리된 RFC 3339 UTC Z 시점입니다. PENDING 상태일 때만 null입니다. */
            processedAt: components["schemas"]["UtcInstant"] | null;
            /** @description 친구 요청의 현재 수명 주기 상태입니다. */
            status: components["schemas"]["FriendRequestStatus"];
        } & ({
            /** @description 상태가 PENDING인 동안 반드시 null입니다. */
            processedAt?: null;
            /**
             * @description 아직 처리되지 않은 요청 분기를 식별하며 반드시 PENDING입니다.
             * @constant
             */
            status?: "PENDING";
        } | {
            /** @description 모든 종결 상태 요청에는 처리 시점이 반드시 있어야 합니다. */
            processedAt?: components["schemas"]["UtcInstant"];
            /**
             * @description 처리 완료된 요청 분기를 식별하는 종결 상태입니다.
             * @enum {unknown}
             */
            status?: "ACCEPTED" | "REJECTED" | "CANCELED";
        });
        FriendRequestPage: {
            /** @description 인증된 학생이 소유한 PENDING 요청이며 createdAt DESC, friendRequestId DESC 순으로 정렬합니다. */
            items: components["schemas"]["FriendRequest"][];
            /** @description 최종 반환된 (createdAt, friendRequestId) 튜플에서 파생된 불투명 커서입니다. 더 이상 항목이 없으면 null입니다. */
            nextCursor: string | null;
        };
        /**
         * @description 친구 요청의 현재 수명 주기 상태입니다. 처리된 요청은 절대 PENDING으로 돌아가지 않습니다.
         * @enum {string}
         */
        FriendRequestStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED";
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
            /** @description 소유자의 표시 별명입니다. 소유자 식별자, 학생 식별자, 계정 데이터 또는 실제 카드 데이터가 노출되지 않습니다. */
            ownerNickname: string;
            /** @description 내림 정수 나눗셈으로 계산합니다. 목표 미도달 진행률은 최대 99이고 목표에 도달했을 때만 100을 반환합니다. */
            progressPercent: number;
            /** @description 게시된 NFC 정규화 위시 목적입니다. */
            purpose: components["schemas"]["Purpose"];
            /** @description 개인정보를 노출하지 않는 이 공유 카드 프로젝션의 안정적인 UUID입니다. 기반 위시 또는 계정 식별자는 노출하지 않습니다. */
            sharedCardId: components["schemas"]["Uuid"];
            /** @description 게시된 양의 정수 KRW 목표 금액입니다. 소유자의 정확한 현재 위시 금액은 노출하지 않습니다. */
            targetAmount: components["schemas"]["KrwPositive"];
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
        /**
         * @description 인증된 학생과 같은 학원 검색 결과 학생 사이의 현재 관계이며 응답 조회 시점에 계산합니다.
         * @enum {string}
         */
        RelationshipState: "NONE" | "FRIEND" | "OUTGOING_PENDING" | "INCOMING_PENDING";
        RepresentativeWishSelectionRequest: {
            /** @description 이 카드 잔액 계정에서 대표로 선택할, 삭제되지 않은 활성 위시의 UUID입니다. */
            wishId: components["schemas"]["Uuid"];
        };
        SharedCard: components["schemas"]["ProgressSharedCard"] | components["schemas"]["CompletionSharedCard"];
        SharedCardPage: {
            /** @description 현재 조회 가능한 진행 카드와 완료 카드를 임시로 contentUpdatedAt DESC, sharedCardId DESC 순으로 정렬합니다. */
            items: components["schemas"]["SharedCard"][];
            /** @description 다음 공유 카드 페이지에 대한 불투명 커서. 추가 페이지가 없으면 null입니다. */
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
            /** @description 결정적인 검색 정렬에 사용하는 현재의 비어 있지 않은 닉네임입니다. */
            nickname: string;
            /** @description 인증된 학생에 대해 정확히 하나의 현재 관계 상태가 계산됩니다. */
            relationshipState: components["schemas"]["RelationshipState"];
            /** @description 동일 학원 검색 결과의 안정적인 UUID입니다. */
            studentId: components["schemas"]["Uuid"];
        };
        StudentRelationshipPage: {
            /** @description 본인, 현재 학원 구성원이 아닌 학생, 양방향 차단 대상을 제외한 같은 학원 검색 결과입니다. nickname ASC, studentId ASC 순으로 정렬합니다. */
            items: components["schemas"]["StudentRelationship"][];
            /** @description 최종 반환된 (닉네임, studentId) 튜플 및 정규화된 닉네임 필터에서 파생된 불투명 커서입니다. 더 이상 항목이 없으면 null입니다. */
            nextCursor: string | null;
        };
        /** @description 실명, 카드 데이터, 위시 데이터, 인증 데이터, 학원 구성원 내부 정보를 제외한 개인정보 최소화 학생 프로젝션입니다. */
        StudentSummary: {
            /** @description 현재 학생 닉네임이며 공백 문자열이 아니고 최대 80개의 유니코드 코드 포인트를 포함합니다. */
            nickname: string;
            /** @description 프로젝션에 포함된 상대 학생의 안정적인 UUID입니다. */
            studentId: components["schemas"]["Uuid"];
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
            /** @description 요청된 게시 범위 PRIVATE, FRIENDS 또는 ACADEMY; 현재 관계 및 차단 확인으로 인해 공유 카드가 더 숨겨질 수 있습니다. */
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
        } | unknown | unknown | unknown | unknown | unknown;
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
        /** @enum {string} */
        WishVisibility: "PRIVATE" | "FRIENDS" | "ACADEMY";
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
        /** @description CARD_BALANCE_ACCOUNT_NOT_FOUND — 계정이 없거나 종료되었거나, 인증된 학생이 소유하지 않거나, 다른 학원 소속인 경우를 숨깁니다. */
        CardBalanceAccountNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description BALANCE_MISMATCH_LOCKED 또는 IDEMPOTENCY_KEY_REUSED입니다. 일치하는 성공 결과의 멱등 재생을 현재 불일치 방어 조건보다 먼저 처리합니다. */
        CreateConflict: {
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
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, BALANCE_MISMATCH_LOCKED, INSUFFICIENT_AVAILABLE_BALANCE, TARGET_AMOUNT_EXCEEDED 또는 IDEMPOTENCY_KEY_REUSED. */
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
        /** @description ACADEMY_NOT_FOUND — 학원이 없거나, 다른 학원이거나, 현재 소속 학원이 아닌 범위를 숨깁니다. */
        FriendManagementAcademyNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description AUTH_REQUIRED — Bearer 토큰이 없거나 유효하지 않습니다. */
        FriendManagementAuthRequired: {
            headers: {
                "WWW-Authenticate": "Bearer";
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description FORBIDDEN — 인증 주체가 학생이 아닙니다. */
        FriendManagementForbidden: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description MALFORMED_REQUEST — JSON, UUID, nickname, limit 또는 불투명 커서의 형식이 잘못되었습니다. */
        FriendManagementMalformedRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 정규 학생 쌍 잠금으로 다시 검증한 뒤 FRIEND_REQUEST_NOT_PENDING, FRIEND_REQUEST_NOT_ACTIONABLE 또는 ALREADY_FRIENDS를 반환합니다. */
        FriendRequestAcceptanceConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description SELF_RELATIONSHIP, ALREADY_FRIENDS, FRIEND_REQUEST_ALREADY_PENDING 또는 INCOMING_FRIEND_REQUEST_PENDING. */
        FriendRequestCreateConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description FRIEND_REQUEST_NOT_PENDING — 접근 권한이 있는 요청이 존재하지만 이미 처리되었습니다. */
        FriendRequestNotPending: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description ACADEMY_NOT_FOUND 또는 FRIEND_REQUEST_NOT_FOUND — 다른 학원, 발신자·수신자 역할 불일치, 그 밖의 권한 없는 요청 식별자를 숨깁니다. */
        FriendRequestOrAcademyNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description ACADEMY_NOT_FOUND 또는 FRIENDSHIP_NOT_FOUND — 관계 부재, 종료 상태, 학원 비소속, 비소유를 숨깁니다. */
        FriendshipOrAcademyNotFound: {
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
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION 또는 BALANCE_MISMATCH_LOCKED. */
        PatchConflict: {
            headers: {
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
        /** @description ACADEMY_NOT_FOUND 또는 SHARED_CARD_NOT_FOUND — 리소스 부재나 현재 공개 범위 조건 위반을 숨깁니다. */
        SharedCardOrAcademyNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION 또는 IDEMPOTENCY_KEY_REUSED. OPEN 잔액 불일치는 완료 또는 포기를 차단하지 않습니다. */
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
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, CROSS_ACCOUNT_TRANSFER_FORBIDDEN, INSUFFICIENT_WISH_AMOUNT, TARGET_AMOUNT_EXCEEDED, BALANCE_MISMATCH_LOCKED 또는 IDEMPOTENCY_KEY_REUSED. */
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
        /** @description CARD_BALANCE_ACCOUNT_NOT_FOUND 또는 WISH_NOT_FOUND — 계정이 없거나 인증된 학생이 소유하지 않은 경우, 또는 위시가 없거나 다른 소유자의 것이거나 해당 계정에 속하지 않은 경우입니다. 소유자가 논리 삭제한 위시는 이력 전용 응답에서 의도적으로 숨기지 않으며 200을 반환합니다. */
        WishHistoryOrAccountNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description 위시 변경이 완료되었습니다. 동일 요청을 재생하면 최초 응답의 상태와 본문을 그대로 반환합니다. */
        WishMutationSuccess: {
            headers: {
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
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, INSUFFICIENT_WISH_AMOUNT 또는 IDEMPOTENCY_KEY_REUSED. */
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
        /** @description 친구 요청의 UUID입니다. 승인되지 않았거나 잘못된 역할 식별자는 FRIEND_REQUEST_NOT_FOUND로 정규화됩니다. */
        FriendRequestId: components["schemas"]["Uuid"];
        /** @description 학생별 영구 네임스페이스입니다. 동일한 작업, 대상, 정규화된 요청에만 키를 재사용할 수 있습니다. */
        IdempotencyKey: string;
        /** @description 본문 없는 DELETE의 동시성 검사를 위한 정확한 음수 아닌 정수 위시 버전입니다. 값이 없거나 정수가 아니면 400, 디코딩된 값이 음수이면 422 INVALID_VERSION, 음수가 아니지만 최신 버전과 다르면 409 VERSION_CONFLICT를 반환합니다. */
        IfMatch: components["schemas"]["WishVersion"];
        Limit: number;
        /** @description 앞뒤의 유니코드 Space_Separator 코드 포인트를 반복해서 제거하고 NFC로 정규화한 뒤, Cc, Cf, Zl, Zp를 거부하며 1~80개의 유니코드 코드 포인트를 요구합니다. 저장된 NFC 정규화 닉네임에서 대소문자를 구분하는 연속 유니코드 코드 포인트 부분 문자열로 일치 여부를 판단합니다. */
        NicknameSearch: string;
        SharedCardId: components["schemas"]["Uuid"];
        /** @description 관계 상대방의 UUID입니다. 인증된 소유자 정보는 항상 현재 인증 주체에서 가져오며 이 매개변수로 받지 않습니다. */
        StudentId: components["schemas"]["Uuid"];
        WishId: components["schemas"]["Uuid"];
    };
    requestBodies: never;
    headers: {
        /** @description 동일한 요청에 대해 원래 상태와 본문이 재생되는 경우에만 true입니다. */
        IdempotencyReplayed: boolean;
    };
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    sendFriendRequest: {
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
                "application/json": components["schemas"]["CreateFriendRequestRequest"];
            };
        };
        responses: {
            /** @description PENDING 상태에서 친구 요청이 생성되었습니다. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FriendRequest"];
                };
            };
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
            404: components["responses"]["StudentOrAcademyNotFound"];
            409: components["responses"]["FriendRequestCreateConflict"];
        };
    };
    cancelFriendRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 친구 요청의 UUID입니다. 승인되지 않았거나 잘못된 역할 식별자는 FRIEND_REQUEST_NOT_FOUND로 정규화됩니다. */
                friendRequestId: components["parameters"]["FriendRequestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 요청이 CANCELED 상태로 취소되고 processedAt에는 null이 아닌 값이 기록됩니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FriendRequest"];
                };
            };
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
            404: components["responses"]["FriendRequestOrAcademyNotFound"];
            409: components["responses"]["FriendRequestNotPending"];
        };
    };
    acceptFriendRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 친구 요청의 UUID입니다. 승인되지 않았거나 잘못된 역할 식별자는 FRIEND_REQUEST_NOT_FOUND로 정규화됩니다. */
                friendRequestId: components["parameters"]["FriendRequestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 요청이 수락되고 현재 친구 관계 하나가 맺어졌습니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Friend"];
                };
            };
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
            404: components["responses"]["FriendRequestOrAcademyNotFound"];
            409: components["responses"]["FriendRequestAcceptanceConflict"];
        };
    };
    rejectFriendRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
                /** @description 친구 요청의 UUID입니다. 승인되지 않았거나 잘못된 역할 식별자는 FRIEND_REQUEST_NOT_FOUND로 정규화됩니다. */
                friendRequestId: components["parameters"]["FriendRequestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 요청이 REJECTED 상태로 거절되고 processedAt에는 null이 아닌 값이 기록됩니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FriendRequest"];
                };
            };
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
            404: components["responses"]["FriendRequestOrAcademyNotFound"];
            409: components["responses"]["FriendRequestNotPending"];
        };
    };
    listReceivedFriendRequests: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
            };
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 인증된 학생이 수신자로 소유한 PENDING 요청입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FriendRequestPage"];
                };
            };
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
            404: components["responses"]["FriendManagementAcademyNotFound"];
        };
    };
    listSentFriendRequests: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
            };
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 인증된 학생이 발신자로 소유한 PENDING 요청입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FriendRequestPage"];
                };
            };
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
            404: components["responses"]["FriendManagementAcademyNotFound"];
        };
    };
    listAcademyFriends: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
            };
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 같은 학원에 속한 친구 관계입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FriendPage"];
                };
            };
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
            404: components["responses"]["FriendManagementAcademyNotFound"];
        };
    };
    unfriendAcademyStudent: {
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
            /** @description 친구 관계가 종료되었습니다. 응답 본문은 없습니다. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
            404: components["responses"]["FriendshipOrAcademyNotFound"];
        };
    };
    listAcademySharedCards: {
        parameters: {
            query?: {
                /** @description 이 API 작업의 고정 정렬 순서에 바인딩된 불투명 커서입니다. */
                cursor?: components["parameters"]["Cursor"];
                limit?: components["parameters"]["Limit"];
            };
            header?: never;
            path: {
                academyId: components["parameters"]["AcademyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 조회 가능한 진행 카드와 완료 카드입니다. */
            200: {
                headers: {
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
            /** @description 현재 조회 가능한 공유 카드 한 건입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SharedCard"];
                };
            };
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["SharedCardOrAcademyNotFound"];
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
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
            404: components["responses"]["FriendManagementAcademyNotFound"];
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
            /** @description 원자적 이체가 완료되었습니다. 동일 요청을 재생하면 최초 응답의 상태와 본문을 그대로 반환합니다. */
            200: {
                headers: {
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
            /** @description 위시가 생성되었습니다. 동일 요청을 재생하면 최초 응답의 상태와 본문을 그대로 반환합니다. */
            201: {
                headers: {
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
            404: components["responses"]["CardBalanceAccountNotFound"];
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
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WishMutationResult"];
                };
            };
            400: components["responses"]["MalformedRequest"];
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishOrAccountNotFound"];
            409: components["responses"]["PatchConflict"];
            415: components["responses"]["UnsupportedMediaType"];
            422: components["responses"]["InvalidAmountPurposeOrVersion"];
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
            503: components["responses"]["BalanceSyncFailed"];
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
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
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
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
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
            400: components["responses"]["FriendManagementMalformedRequest"];
            401: components["responses"]["FriendManagementAuthRequired"];
            403: components["responses"]["FriendManagementForbidden"];
            404: components["responses"]["StudentBlockNotFound"];
        };
    };
}
