export interface paths {
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
         * List currently visible Shared Cards in an academy
         * @description Re-evaluates membership, friendship, and bilateral blocking on every read; excludes the owner; PRIVATE Wishes create no card. Provisional ordering: contentUpdatedAt DESC, then sharedCardId DESC. No sort parameter is currently supported. Under this temporary policy, only content or publication changes reorder cards. Friend-priority and embedding-based recommendation ordering remain open for a future contract and are not active in this version.
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
         * Get one currently visible Shared Card
         * @description The owner may read their own currently public card; every other absence or visibility failure is hidden.
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
         * Get an owned Card Balance Account
         * @description Returns the authenticated student's active account from the current persisted projection. A random identifier, closed account, ownership mismatch, and academy mismatch are hidden as the same not-found response. This operation performs no external balance lookup and mutates no persistent state. UNKNOWN amounts remain null. After a successful lookup, a later failed attempt retains the latest successful amounts and lastRefreshedAt while reporting lastRefreshStatus FAILED.
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
         * Refresh the current card balance
         * @description Bodyless USER_REQUESTED lookup. This operation is deliberately not idempotency-keyed and remains allowed while a Balance Adjustment Case is OPEN; the response reports the resulting current adjustment flag.
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
         * List immutable nonzero card-balance changes
         * @description Returns only successful observations that produced a nonzero CARD_BALANCE_CHANGE ledger event. Failed observations and successful zero-delta observations remain persisted operational facts but are not money-history items. Results are ordered by occurredAt DESC then eventId DESC. The opaque cursor is bound to this operation, account, ordering version, and final (occurredAt, eventId) tuple; an invalid or mismatched cursor returns 400 without a partial page. Continuation is strictly below that tuple, so eventId stabilizes equal timestamps and later events sorting before the boundary do not alter the continuation. Any valid limit may be used with a valid cursor. Authorization and ownership are re-evaluated on every request, and no cacheability guarantee is introduced.
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
         * List all immutable account-level fund movements
         * @description Returns one item per immutable ledger event, including external card changes and every Wish movement. A Wish transfer is one account item even though it has two Wish effects. Results are ordered by occurredAt DESC then eventId DESC. The opaque cursor is bound to this operation, account, ordering version, and final tuple; malformed or mismatched cursors return 400 without a partial page. Continuation is strictly below that tuple, so eventId stabilizes equal timestamps and later events sorting before the boundary do not alter the continuation. Any valid limit may be used with a valid cursor. Corrections are new compensating events and never edit or delete an earlier event. Authorization and ownership are re-evaluated on every request, and no cacheability guarantee is introduced.
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
        /** Atomically transfer funds between two Wishes in one account */
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
         * List non-deleted Wishes owned by the account
         * @description Ordered by createdAt DESC then id DESC using an opaque cursor. Each Wish reports the read-time OPEN adjustment state of its Card Balance Account.
         */
        get: operations["listWishes"];
        put?: never;
        /**
         * Create a private zero-funded Wish
         * @description Creates amount 0, state IN_PROGRESS, and visibility PRIVATE when balance knowledge is UNKNOWN or no mismatch is open. A matching successful Idempotency-Key result is replayed before evaluating the current mismatch guard. Otherwise, an OPEN Balance Adjustment Case rejects creation with 409 BALANCE_MISMATCH_LOCKED before a new Wish is persisted.
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
         * Get an owned non-deleted Wish
         * @description Returns the read-time OPEN adjustment state of the Wish's Card Balance Account; an open case does not block this read.
         */
        get: operations["getWish"];
        put?: never;
        post?: never;
        /**
         * Tombstone a Wish
         * @description Returns a final mutation result; all later reads are hidden as WISH_NOT_FOUND. An OPEN Balance Adjustment Case does not block deletion.
         */
        delete: operations["deleteWish"];
        options?: never;
        head?: never;
        /**
         * Atomically merge-patch mutable Wish fields
         * @description Omission preserves a field; targetDate null clears it. Outside a mismatch, completed Wishes may change visibility only. An OPEN Balance Adjustment Case rejects every requested patch field, including purpose, targetAmount, targetDate, and every visibility change whether widening, narrowing, or changing to PRIVATE.
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
         * Abandon a Wish and make it permanently private
         * @description An OPEN Balance Adjustment Case does not block abandonment; the returned Wish carries the committed post-mutation adjustment flag.
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
         * Complete an amount-reached Wish
         * @description An OPEN Balance Adjustment Case does not block completion; the returned Wish carries the committed post-mutation adjustment flag.
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
         * Deposit Card Balance Account funds into one Wish
         * @description Performs PRE_DEPOSIT lookup internally. Provider failure leaves the Wish unchanged; a persisted mismatch observation locks and rejects only this deposit.
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
         * List immutable fund movements projected for one Wish
         * @description Returns immutable ledger Wish effects for the requested owned Wish only; external card changes never appear. An owned tombstoned Wish remains readable here even though ordinary Wish detail returns 404. Results are ordered by occurredAt DESC then eventId DESC. The opaque cursor is bound to this operation, account, Wish, ordering version, and final tuple; malformed or mismatched cursors return 400 without a partial page. Continuation is strictly below that tuple, so eventId stabilizes equal timestamps and later events sorting before the boundary do not alter the continuation. Any valid limit may be used with a valid cursor. Authorization and ownership are re-evaluated on every request, and no cacheability guarantee is introduced.
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
        /** Withdraw funds from one Wish */
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
         * List the authenticated student's Card Balance Accounts
         * @description UNKNOWN balances remain null rather than being fabricated as zero. Each account also reports whether an account-scoped Balance Adjustment Case is currently OPEN.
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
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AccountCardBalanceChange: {
            /** @description Signed ledger-available account balance immediately after the event; negative values are preserved and never display-clamped. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description Signed ledger-available account balance change, exactly equal to actualCardBalanceDelta. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"];
            /** @description Non-negative integer KRW observed after this external change. */
            actualCardBalanceAfter: components["schemas"]["KrwNonNegative"];
            /** @description Nonzero signed integer KRW external card-balance change. */
            actualCardBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null; the earlier event remains unchanged.
             */
            correctionOfEventId: string | null;
            /** @description UUID of this immutable CARD_BALANCE_CHANGE event; identical to the corresponding CardBalanceChange eventId. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always CARD_BALANCE_CHANGE, identifying a successful nonzero external card-balance change. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "CARD_BALANCE_CHANGE";
            /** @description Trigger for the linked observation: USER_REQUESTED, PRE_DEPOSIT, or AUTO_DAILY. */
            lookupMethod: components["schemas"]["BalanceLookupMethod"];
            /** @description UUID of the exact successful balance observation linked to this event. */
            observationId: components["schemas"]["Uuid"];
            /** @description RFC 3339 UTC Z instant equal to the linked observation's observedAt value. */
            occurredAt: components["schemas"]["UtcInstant"];
        };
        AccountFundMovement: components["schemas"]["AccountCardBalanceChange"] | components["schemas"]["AccountWishDeposit"] | components["schemas"]["AccountWishWithdrawal"] | components["schemas"]["AccountWishTransfer"] | components["schemas"]["AccountWishCompletionReturn"] | components["schemas"]["AccountWishAbandonmentReturn"] | components["schemas"]["AccountWishDeletionReturn"];
        AccountFundMovementPage: {
            /** @description One item per immutable ledger event in occurredAt descending, eventId descending order, including external card changes and every Wish movement. */
            items: components["schemas"]["AccountFundMovement"][];
            /** @description Opaque cursor derived from the final returned (occurredAt, eventId) tuple when another item exists; null for empty and terminal pages. */
            nextCursor: string | null;
        };
        AccountWishAbandonmentReturn: {
            /** @description Signed ledger-available account balance immediately after the abandonment return. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description Positive integer KRW returned from the abandoned Wish; a zero return creates no event or history item. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description UUID of the immutable ledger event shared with the abandoned Wish's movement projection. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_ABANDONMENT_RETURN, identifying nonzero funds returned during abandonment. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_ABANDONMENT_RETURN";
            /** @description RFC 3339 UTC Z instant at which abandonment returned the remaining Wish funds. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description Event-time purpose and read-time tombstone context for the abandoned Wish. */
            wish: components["schemas"]["WishHistoryReference"];
        };
        AccountWishCompletionReturn: {
            /** @description Signed ledger-available account balance immediately after the completion return. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description Positive integer KRW returned from the completed Wish; a zero return creates no event or history item. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description UUID of the immutable ledger event shared with the completed Wish's movement projection. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_COMPLETION_RETURN, identifying nonzero funds returned during explicit completion. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_COMPLETION_RETURN";
            /** @description RFC 3339 UTC Z instant at which completion returned the remaining Wish funds. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description Event-time purpose and read-time tombstone context for the completed Wish. */
            wish: components["schemas"]["WishHistoryReference"];
        };
        AccountWishDeletionReturn: {
            /** @description Signed ledger-available account balance immediately after the deletion return. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description Positive integer KRW returned from the deleted Wish; a zero return creates no event or history item. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description UUID of the immutable ledger event shared with the tombstoned Wish's movement projection. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_DELETION_RETURN, identifying nonzero funds returned during tombstone deletion. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_DELETION_RETURN";
            /** @description RFC 3339 UTC Z instant at which deletion returned the remaining Wish funds. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description Deletion-time purpose and read-time tombstone context for the deleted Wish. */
            wish: components["schemas"]["WishHistoryReference"];
        };
        AccountWishDeposit: {
            /** @description Signed ledger-available account balance immediately after the deposit. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description Negative integer KRW change to ledger-available account balance caused by this deposit. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description UUID of the immutable ledger event, shared with the corresponding Wish deposit projection. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_DEPOSIT, identifying funds allocated from account availability to one Wish. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_DEPOSIT";
            /** @description RFC 3339 UTC Z instant at which this immutable deposit event occurred. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description Event-time purpose and read-time tombstone context for the Wish that received the funds. */
            wish: components["schemas"]["WishHistoryReference"];
        };
        AccountWishTransfer: {
            /** @description Signed ledger-available account balance after the transfer, unchanged by the transfer itself. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /**
             * @description Always zero because a same-account Wish transfer does not change account-level availability.
             * @constant
             */
            accountAvailableBalanceDelta: 0;
            /** @description Positive integer KRW moved atomically from sourceWish to destinationWish. */
            amount: components["schemas"]["KrwPositive"];
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description Event-time purpose and read-time tombstone context for the distinct destination Wish. */
            destinationWish: components["schemas"]["WishHistoryReference"];
            /** @description UUID of the one immutable ledger event shared by both opposite-signed Wish transfer projections. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_TRANSFER, identifying an atomic transfer between two distinct Wishes in the same account. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_TRANSFER";
            /** @description RFC 3339 UTC Z instant shared by both immutable Wish effects of the transfer. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description Event-time purpose and read-time tombstone context for the distinct source Wish. */
            sourceWish: components["schemas"]["WishHistoryReference"];
        };
        AccountWishWithdrawal: {
            /** @description Signed ledger-available account balance immediately after the withdrawal. */
            accountAvailableBalanceAfter: components["schemas"]["KrwSigned"];
            /** @description Positive integer KRW change to ledger-available account balance caused by this withdrawal. */
            accountAvailableBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description UUID of the immutable ledger event, shared with the corresponding Wish withdrawal projection. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_WITHDRAWAL, identifying funds returned from one Wish to account availability. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_WITHDRAWAL";
            /** @description RFC 3339 UTC Z instant at which this immutable withdrawal event occurred. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description Event-time purpose and read-time tombstone context for the Wish from which funds were withdrawn. */
            wish: components["schemas"]["WishHistoryReference"];
        };
        /** @description Immutable ledger-to-adjustment-case event-link provenance, not the case's mutable current status. Observation-only first-success mismatch facts do not create history items, and shortage amount, notification state, and unrelated observation data are not exposed here. */
        BalanceAdjustmentEventReference: {
            /** @description UUID of the Balance Adjustment Case linked to this immutable ledger event. */
            adjustmentCaseId: components["schemas"]["Uuid"];
            /**
             * @description Immutable role of this event inside the adjustment case: opening decrease, intermediate compensation, or resolution.
             * @enum {string}
             */
            eventRole: "OPENING_DECREASE" | "INTERMEDIATE" | "RESOLUTION";
            /** @description Zero-based immutable order of this event link inside the adjustment case. */
            sequenceNumber: number;
        };
        /**
         * @description Internal account adjustment-state vocabulary used only in owner error details, never in Shared Card projections.
         * @enum {string}
         */
        BalanceAdjustmentStatus: "OPEN" | "RESOLVED";
        /** @enum {string} */
        BalanceLookupMethod: "USER_REQUESTED" | "PRE_DEPOSIT" | "AUTO_DAILY";
        BalanceRefreshResult: {
            /** @description Updated KNOWN Card Balance Account snapshot derived from this successful observation. */
            account: components["schemas"]["KnownCardBalanceAccount"];
            /**
             * @description Always USER_REQUESTED because this public bodyless operation performs a user-requested lookup and does not accept a client-selected method.
             * @constant
             */
            lookupMethod: "USER_REQUESTED";
            /** @description UUID of the newly persisted successful balance observation. */
            observationId: components["schemas"]["Uuid"];
            /** @description RFC 3339 UTC Z instant at which this external balance lookup attempt was made. */
            observedAt: components["schemas"]["UtcInstant"];
        };
        CardBalanceAccount: components["schemas"]["UnknownCardBalanceAccount"] | components["schemas"]["KnownCardBalanceAccount"];
        CardBalanceAccountPage: {
            /** @description Card Balance Accounts visible to the authenticated student in this page. */
            items: components["schemas"]["CardBalanceAccount"][];
            /** @description Opaque cursor for the next account page; null when no further page exists. */
            nextCursor: string | null;
        };
        CardBalanceChange: {
            /** @description Non-negative integer KRW observed by this successful lookup. */
            actualCardBalanceAfter: components["schemas"]["KrwNonNegative"];
            /** @description Nonzero signed integer KRW change from the prior successful observed balance, or from zero for the first successful observation. */
            actualCardBalanceDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable Balance Adjustment Case event-link provenance for this ledger event, or null when the event is not linked to an adjustment case. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description UUID of an earlier immutable event in the same account that this new event compensates; null when this is not a correction. The earlier event remains unchanged.
             */
            correctionOfEventId: string | null;
            /** @description UUID of the immutable CARD_BALANCE_CHANGE ledger event; the same value identifies this fact in account fund-movement history. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always CARD_BALANCE_CHANGE because observation failures and successful zero-delta observations do not create money-history events.
             * @constant
             */
            eventType: "CARD_BALANCE_CHANGE";
            /** @description Trigger for this lookup: USER_REQUESTED, PRE_DEPOSIT, or AUTO_DAILY. */
            lookupMethod: components["schemas"]["BalanceLookupMethod"];
            /** @description UUID of the exact successful external balance observation linked to this immutable event. */
            observationId: components["schemas"]["Uuid"];
            /** @description RFC 3339 UTC Z instant equal to the linked successful observation's observedAt value. */
            occurredAt: components["schemas"]["UtcInstant"];
        };
        CardBalanceChangePage: {
            /** @description Immutable nonzero CARD_BALANCE_CHANGE events in occurredAt descending, eventId descending order; failed and zero-delta observations are excluded. */
            items: components["schemas"]["CardBalanceChange"][];
            /** @description Opaque cursor derived from the final returned (occurredAt, eventId) tuple when another item exists; null for empty and terminal pages. */
            nextCursor: string | null;
        };
        CompletionSharedCard: {
            /**
             * Format: int64
             * @description Non-negative elapsed whole seconds from createdAt through completedAt.
             */
            actualDurationSeconds: number;
            /** @description RFC 3339 UTC Z instant at which the owner explicitly completed the Wish. */
            completedAt: components["schemas"]["UtcInstant"];
            /** @description RFC 3339 UTC Z instant of the latest content or publication change used by provisional ordering. */
            contentUpdatedAt: components["schemas"]["UtcInstant"];
            /** @description RFC 3339 UTC Z instant at which the underlying Wish was created. */
            createdAt: components["schemas"]["UtcInstant"];
            /**
             * @description COMPLETION discriminator identifying an explicitly completed published Wish card. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            kind: "COMPLETION";
            /** @description Owner's display nickname; no owner identifier, student identifier, account data, or physical-card data is exposed. */
            ownerNickname: string;
            /**
             * @description Always 100 for the completed-card variant.
             * @constant
             */
            progressPercent: 100;
            /** @description Published NFC-normalized Wish purpose. */
            purpose: components["schemas"]["Purpose"];
            /** @description Stable UUID of this privacy-safe Shared Card projection; it does not expose the underlying Wish or account identifier. */
            sharedCardId: components["schemas"]["Uuid"];
            /** @description Published positive integer KRW target amount; the owner's exact historical Wish balance is not exposed. */
            targetAmount: components["schemas"]["KrwPositive"];
            /**
             * Format: date
             * @description Optional owner-supplied target calendar date; null when the completed Wish had no target date.
             */
            targetDate: string | null;
        };
        CreateWishRequest: {
            purpose: components["schemas"]["PurposeInput"];
            targetAmount: components["schemas"]["KrwPositive"];
            /** Format: date */
            targetDate?: string | null;
        };
        Cursor: string;
        /** @enum {string} */
        ErrorCode: "MALFORMED_REQUEST" | "EXPECTED_VERSION_REQUIRED" | "IDEMPOTENCY_KEY_REQUIRED" | "AUTH_REQUIRED" | "FORBIDDEN" | "CARD_BALANCE_ACCOUNT_NOT_FOUND" | "WISH_NOT_FOUND" | "ACADEMY_NOT_FOUND" | "SHARED_CARD_NOT_FOUND" | "VERSION_CONFLICT" | "INVALID_STATE_TRANSITION" | "BALANCE_MISMATCH_LOCKED" | "INSUFFICIENT_AVAILABLE_BALANCE" | "INSUFFICIENT_WISH_AMOUNT" | "TARGET_AMOUNT_EXCEEDED" | "CROSS_ACCOUNT_TRANSFER_FORBIDDEN" | "IDEMPOTENCY_KEY_REUSED" | "UNSUPPORTED_MEDIA_TYPE" | "INVALID_AMOUNT" | "INVALID_PURPOSE" | "INVALID_VERSION" | "BALANCE_SYNC_FAILED";
        ErrorEnvelope: {
            /** @description Structured error payload shared by every declared non-success JSON response. */
            error: {
                /** @description Stable machine-readable ErrorCode; clients should branch on this value rather than message text. */
                code: components["schemas"]["ErrorCode"];
                /** @description Extensible code-specific metadata object; empty when no details apply, and clients must ignore unrecognized keys. */
                details: {
                    [key: string]: unknown;
                };
                /** @description Field-specific validation failures; empty when the error is not attributable to individual request fields. */
                fieldErrors: components["schemas"]["FieldError"][];
                /** @description Human-readable explanation of this occurrence; it is not the stable machine decision key. */
                message: string;
                /** @description True only for BALANCE_SYNC_FAILED; false for every defined client, authorization, not-found, validation, and state-conflict error. */
                retryable: boolean;
                /** @description Opaque server correlation identifier for diagnostics and support; it has no domain meaning. */
                traceId: string;
            } & unknown;
        };
        FieldError: {
            /** @description Name of the invalid request field, parameter, or header associated with this validation failure. */
            field: string;
            /** @description Human-readable explanation of the field-specific failure. */
            message: string;
        };
        KnownCardBalanceAccount: {
            /** @description UUID of the academy to which this Card Balance Account belongs. */
            academyId: components["schemas"]["Uuid"];
            /** @description Non-negative integer KRW observed by the most recent successful external card-balance lookup. */
            actualCardBalance: components["schemas"]["KrwNonNegative"];
            /** @description True iff an account-scoped Balance Adjustment Case is OPEN at response read time; false when no OPEN case exists, including RESOLVED-only history. Derived rather than persisted on the account, this flag and the balance fields come from one consistent account projection; a later failed lookup retains the latest successful amounts while the flag reflects the current case. */
            balanceAdjustmentInProgress: boolean;
            /**
             * @description KNOWN means at least one successful external balance observation supplies the returned balance values. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            balanceKnowledge: "KNOWN";
            /** @description Stable UUID of the student's Card Balance Account. */
            cardBalanceAccountId: components["schemas"]["Uuid"];
            /** @description Non-negative integer KRW equal to max(0, ledgerAvailableBalance) for display. */
            displayAvailableBalance: components["schemas"]["KrwNonNegative"];
            /** @description RFC 3339 UTC Z instant of the successful observation backing the returned amounts; retained when a later lookup fails. */
            lastRefreshedAt: components["schemas"]["UtcInstant"];
            /**
             * @description Outcome of the most recent lookup attempt; FAILED may coexist with amounts preserved from an earlier successful observation.
             * @enum {string}
             */
            lastRefreshStatus: "SUCCESS" | "FAILED";
            /** @description Signed integer KRW equal to actualCardBalance minus the total held by active Wishes; a negative value is preserved. */
            ledgerAvailableBalance: components["schemas"]["KrwSigned"];
            /** @description Non-negative integer KRW equal to max(0, -ledgerAvailableBalance); zero means no unresolved shortage. */
            unresolvedShortage: components["schemas"]["KrwNonNegative"];
        };
        /** Format: int64 */
        KrwNonNegative: number;
        /** Format: int64 */
        KrwPositive: number;
        /**
         * Format: int64
         * @description Fractional KRW is never accepted.
         */
        KrwSigned: number;
        /** @enum {string} */
        LedgerEventType: "CARD_BALANCE_CHANGE" | "WISH_DEPOSIT" | "WISH_WITHDRAWAL" | "WISH_TRANSFER" | "WISH_COMPLETION_RETURN" | "WISH_ABANDONMENT_RETURN" | "WISH_DELETION_RETURN";
        ProgressSharedCard: {
            /** @description True iff the owning Card Balance Account has an OPEN BalanceAdjustmentCase at response read time; absent and RESOLVED-only histories emit false. This value is not persisted on SharedCard and does not update contentUpdatedAt or ordering. */
            balanceAdjustmentInProgress: boolean;
            /** @description RFC 3339 UTC Z instant of the latest content or publication change used by provisional ordering; read-time relationship checks and balanceAdjustmentInProgress do not change it. */
            contentUpdatedAt: components["schemas"]["UtcInstant"];
            /**
             * @description PROGRESS discriminator identifying a currently published non-completed Wish card. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            kind: "PROGRESS";
            /** @description Owner's display nickname; no owner identifier, student identifier, account data, or physical-card data is exposed. */
            ownerNickname: string;
            /** @description Floor integer division; unreached progress is capped at 99 and only a reached target emits 100. */
            progressPercent: number;
            /** @description Published NFC-normalized Wish purpose. */
            purpose: components["schemas"]["Purpose"];
            /** @description Stable UUID of this privacy-safe Shared Card projection; it does not expose the underlying Wish or account identifier. */
            sharedCardId: components["schemas"]["Uuid"];
            /** @description Published positive integer KRW target amount; the owner's exact current Wish amount is not exposed. */
            targetAmount: components["schemas"]["KrwPositive"];
        };
        /** @description NFC-normalized, boundary-space-free Unicode text containing 1 through 200 code points. Cc, Cf, Zl, and Zp characters are forbidden; internal Space_Separator characters are preserved. */
        Purpose: string;
        /**
         * @description Purpose request normalization is ordered as follows.
         *     1. Decode the request value as a string.
         *     2. Reject any decoded input containing Unicode general-category Cc, Cf, Zl, or Zp anywhere with 422 INVALID_PURPOSE.
         *     3. Repeatedly remove every leading and trailing Unicode Space_Separator code point (general category Zs), including ASCII SPACE and NBSP U+00A0; preserve internal spaces.
         *     4. Normalize the boundary-trimmed value to Unicode NFC.
         *     5. Count Unicode code points after NFC normalization. Persist and return values containing 1 through 200 Unicode code points; otherwise return 422 INVALID_PURPOSE.
         */
        PurposeInput: string;
        SharedCard: components["schemas"]["ProgressSharedCard"] | components["schemas"]["CompletionSharedCard"];
        SharedCardPage: {
            /** @description Currently visible progress and completion cards in provisional contentUpdatedAt descending, sharedCardId descending order. */
            items: components["schemas"]["SharedCard"][];
            /** @description Opaque cursor for the next Shared Card page; null when no further page exists. */
            nextCursor: string | null;
        };
        UnknownCardBalanceAccount: {
            /** @description UUID of the academy to which this Card Balance Account belongs. */
            academyId: components["schemas"]["Uuid"];
            /** @description Always null because no successful external balance observation exists; null means unknown, not zero KRW. */
            actualCardBalance: null;
            /**
             * @description Always false because an OPEN Balance Adjustment Case requires a successful balance observation, which an UNKNOWN account does not have.
             * @constant
             */
            balanceAdjustmentInProgress: false;
            /**
             * @description UNKNOWN means no successful external balance observation exists; null balance values must never be interpreted as zero. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            balanceKnowledge: "UNKNOWN";
            /** @description Stable UUID of the student's Card Balance Account. */
            cardBalanceAccountId: components["schemas"]["Uuid"];
            /** @description Always null until actual card balance is known; the UI must not display it as zero KRW. */
            displayAvailableBalance: null;
            /** @description Always null because no successful observation exists; failed-attempt time is represented in observation history instead. */
            lastRefreshedAt: null;
            /**
             * @description FAILED when the latest lookup attempt failed before any successful observation; null when no lookup attempt has been recorded.
             * @enum {string|null}
             */
            lastRefreshStatus: "FAILED" | null;
            /** @description Always null until actual card balance is known; the service must not calculate it from a fabricated zero. */
            ledgerAvailableBalance: null;
            /** @description Always null until actual card balance is known; unknown shortage is not the same as no shortage. */
            unresolvedShortage: null;
        };
        /** Format: date */
        UtcDate: string;
        /**
         * Format: date-time
         * @description RFC 3339 UTC instant whose wire representation ends in Z.
         */
        UtcInstant: string;
        /** Format: uuid */
        Uuid: string;
        Wish: {
            /**
             * Format: int64
             * @description For completed Wishes, the elapsed whole seconds from createdAt through completedAt; null otherwise.
             */
            actualDurationSeconds: number | null;
            /** @description Non-negative integer KRW currently allocated to this Wish; it is distinct from actual card balance and never exceeds targetAmount. */
            amount: components["schemas"]["KrwNonNegative"];
            /** @description True iff this Wish's Card Balance Account has an OPEN Balance Adjustment Case for this response snapshot; derived and not persisted on the Wish or Shared Card. List and detail responses reflect read time, mutation responses reflect committed post-mutation state, and opening or resolving a case does not advance Wish version or updatedAt. This projection exposes only the boolean, never shortage amount, adjustmentCaseId, observationId, event links, or account history. */
            balanceAdjustmentInProgress: boolean;
            /** @description UUID of the owner Card Balance Account to which this Wish is permanently attached. */
            cardBalanceAccountId: components["schemas"]["Uuid"];
            /**
             * Format: date-time
             * @description RFC 3339 UTC Z instant of explicit completion for a COMPLETED Wish; null for every other state.
             */
            completedAt: string | null;
            /** @description RFC 3339 UTC Z instant at which the Wish was created. */
            createdAt: components["schemas"]["UtcInstant"];
            /** @description Stable UUID of this Wish. */
            id: components["schemas"]["Uuid"];
            /** @description NFC-normalized, boundary-space-free purpose text persisted for this Wish. */
            purpose: components["schemas"]["Purpose"];
            /** @description Lifecycle state: IN_PROGRESS below target, AMOUNT_REACHED at target before explicit completion, COMPLETED after completion, or ABANDONED after abandonment. */
            state: components["schemas"]["WishState"];
            /** @description Positive integer KRW goal for this Wish. */
            targetAmount: components["schemas"]["KrwPositive"];
            /**
             * Format: date
             * @description Optional calendar date that may be in the past, present, or future.
             */
            targetDate: string | null;
            /** @description RFC 3339 UTC Z instant of the most recent successful Wish content or lifecycle mutation. */
            updatedAt: components["schemas"]["UtcInstant"];
            /** @description Non-negative optimistic concurrency version of this snapshot; successful state-changing mutations advance it and idempotent replay returns the original value. */
            version: components["schemas"]["WishVersion"];
            /** @description Requested publication scope PRIVATE, FRIENDS, or ACADEMY; current relationship and blocking checks may further hide any Shared Card. */
            visibility: components["schemas"]["WishVisibility"];
        };
        WishAbandonmentReturnMovement: {
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description UUID of the immutable ledger event shared with the account-level abandonment-return projection. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_ABANDONMENT_RETURN, identifying nonzero funds removed during abandonment. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_ABANDONMENT_RETURN";
            /** @description RFC 3339 UTC Z instant at which abandonment returned the Wish funds. */
            occurredAt: components["schemas"]["UtcInstant"];
            /**
             * @description Always zero KRW after abandonment.
             * @constant
             */
            wishAmountAfter: 0;
            /** @description Negative integer KRW returned from this Wish; a zero return creates no event or history item. */
            wishAmountDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable purpose captured for this Wish by the ledger effect when abandonment occurred. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        };
        WishAmountCommand: {
            amount: components["schemas"]["KrwPositive"];
            expectedVersion: components["schemas"]["WishVersion"];
        };
        WishCompletionReturnMovement: {
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description UUID of the immutable ledger event shared with the account-level completion-return projection. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_COMPLETION_RETURN, identifying nonzero funds removed during explicit completion. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_COMPLETION_RETURN";
            /** @description RFC 3339 UTC Z instant at which completion returned the Wish funds. */
            occurredAt: components["schemas"]["UtcInstant"];
            /**
             * @description Always zero KRW after explicit completion.
             * @constant
             */
            wishAmountAfter: 0;
            /** @description Negative integer KRW returned from this Wish; a zero return creates no event or history item. */
            wishAmountDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable purpose captured for this Wish by the ledger effect when completion occurred. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        };
        WishDeletionReturnMovement: {
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description UUID of the immutable ledger event shared with the account-level deletion-return projection. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_DELETION_RETURN, identifying nonzero funds removed during tombstone deletion. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_DELETION_RETURN";
            /** @description RFC 3339 UTC Z instant at which deletion returned the Wish funds. */
            occurredAt: components["schemas"]["UtcInstant"];
            /**
             * @description Always zero KRW after tombstone deletion.
             * @constant
             */
            wishAmountAfter: 0;
            /** @description Negative integer KRW returned from this Wish; a zero return creates no event or history item. */
            wishAmountDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable deletion-time purpose captured for this Wish by the ledger effect. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        };
        WishDepositMovement: {
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description UUID of the immutable ledger event shared with the account-level deposit projection. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_DEPOSIT, identifying funds added to this Wish. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_DEPOSIT";
            /** @description RFC 3339 UTC Z instant at which this immutable deposit event occurred. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description Non-negative integer KRW held by this Wish immediately after the deposit. */
            wishAmountAfter: components["schemas"]["KrwNonNegative"];
            /** @description Positive integer KRW added to this Wish. */
            wishAmountDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable purpose captured for this Wish by the ledger effect when the event occurred. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        };
        WishFundMovement: components["schemas"]["WishDepositMovement"] | components["schemas"]["WishWithdrawalMovement"] | components["schemas"]["WishTransferMovement"] | components["schemas"]["WishCompletionReturnMovement"] | components["schemas"]["WishAbandonmentReturnMovement"] | components["schemas"]["WishDeletionReturnMovement"];
        WishFundMovementPage: {
            /** @description Immutable ledger effects for this Wish only, in occurredAt descending, eventId descending order; CARD_BALANCE_CHANGE never appears. */
            items: components["schemas"]["WishFundMovement"][];
            /** @description Opaque cursor derived from the final returned (occurredAt, eventId) tuple when another item exists; null for empty and terminal pages. */
            nextCursor: string | null;
            /** @description Read-time subject context for the owned active or tombstoned Wish whose immutable effects are returned. */
            wish: components["schemas"]["WishHistorySubject"];
        };
        WishHistoryReference: {
            /** @description True when the referenced Wish is tombstoned at response read time. */
            deletedWish: boolean;
            /** @description Whether ordinary Wish detail navigation is currently available; always false when deletedWish is true. No URL or path is emitted. */
            detailAvailable: boolean;
            /** @description Stable UUID of the Wish referenced by this account-level event. */
            wishId: components["schemas"]["Uuid"];
            /** @description Immutable Wish purpose captured by the ledger Wish effect when the event occurred. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        } & unknown;
        WishHistorySubject: {
            /** @description True when this owned Wish is tombstoned at response read time. */
            deletedWish: boolean;
            /** @description Exact logical negation of deletedWish; false prevents navigation to ordinary detail for a tombstoned Wish. No URL or path is emitted. */
            detailAvailable: boolean;
            /** @description Current purpose for an active Wish, or the purpose snapshot captured immediately before tombstoning for a deleted Wish. */
            displayPurpose: components["schemas"]["Purpose"];
            /** @description Stable UUID of the owned Wish whose immutable history is returned. */
            wishId: components["schemas"]["Uuid"];
        } & unknown;
        WishMergePatch: {
            expectedVersion: components["schemas"]["WishVersion"];
            purpose?: components["schemas"]["PurposeInput"];
            targetAmount?: components["schemas"]["KrwPositive"];
            /** Format: date */
            targetDate?: string | null;
            visibility?: components["schemas"]["WishVisibility"];
        } | unknown | unknown | unknown | unknown;
        WishMutationResult: {
            /**
             * Format: uuid
             * @description UUID of the immutable ledger event created by the mutation; null when the mutation moves no funds and therefore creates no ledger event.
             */
            eventId: string | null;
            /** @description Authoritative Wish snapshot after the mutation, or the original snapshot returned by an identical idempotent replay. */
            wish: components["schemas"]["Wish"];
        };
        WishPage: {
            /** @description Non-deleted owned Wishes in createdAt descending, id descending order. */
            items: components["schemas"]["Wish"][];
            /** @description Opaque cursor for the next Wish page; null when no further page exists. */
            nextCursor: string | null;
        };
        /** @enum {string} */
        WishState: "IN_PROGRESS" | "AMOUNT_REACHED" | "COMPLETED" | "ABANDONED";
        WishTransferMovement: {
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description Event-time purpose and read-time tombstone context for the distinct other Wish in the transfer. */
            counterpartyWish: components["schemas"]["WishHistoryReference"];
            /**
             * @description SOURCE with a negative wishAmountDelta when this Wish sent funds; DESTINATION with a positive delta when it received funds.
             * @enum {string}
             */
            direction: "SOURCE" | "DESTINATION";
            /** @description UUID of the one immutable ledger event shared by both opposite-signed Wish transfer projections. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_TRANSFER, identifying one side of an atomic same-account Wish transfer.
             * @constant
             */
            eventType: "WISH_TRANSFER";
            /** @description RFC 3339 UTC Z instant shared by both immutable Wish effects of the transfer. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description Non-negative integer KRW held by this Wish immediately after the transfer. */
            wishAmountAfter: components["schemas"]["KrwNonNegative"];
            /** @description Signed integer KRW effect on this Wish: negative for SOURCE and positive for DESTINATION. */
            wishAmountDelta: components["schemas"]["KrwSigned"];
            /** @description Immutable purpose captured for this Wish by its ledger effect when the transfer occurred. */
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
            /** @description Authoritative destination Wish snapshot after the atomic transfer. */
            destinationWish: components["schemas"]["Wish"];
            /** @description UUID of the single immutable ledger event containing both transfer effects. */
            eventId: components["schemas"]["Uuid"];
            /** @description RFC 3339 UTC Z instant shared by the source and destination effects of the transfer. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description Authoritative source Wish snapshot after the atomic transfer. */
            sourceWish: components["schemas"]["Wish"];
        };
        /**
         * Format: int64
         * @description A missing or non-integer required request version remains 400 MALFORMED_REQUEST; a decoded negative version returns 422 INVALID_VERSION; a stale non-negative version returns 409 VERSION_CONFLICT.
         */
        WishVersion: number;
        WishVersionCommand: {
            expectedVersion: components["schemas"]["WishVersion"];
        };
        /** @enum {string} */
        WishVisibility: "PRIVATE" | "FRIENDS" | "ACADEMY";
        WishWithdrawalMovement: {
            /** @description Immutable Balance Adjustment Case event-link provenance, or null when this event has no adjustment-case link. */
            balanceAdjustment: components["schemas"]["BalanceAdjustmentEventReference"] | null;
            /**
             * Format: uuid
             * @description Earlier immutable same-account event compensated by this new event, or null.
             */
            correctionOfEventId: string | null;
            /** @description UUID of the immutable ledger event shared with the account-level withdrawal projection. */
            eventId: components["schemas"]["Uuid"];
            /**
             * @description Always WISH_WITHDRAWAL, identifying funds removed from this Wish. (enum property replaced by openapi-typescript)
             * @enum {string}
             */
            eventType: "WISH_WITHDRAWAL";
            /** @description RFC 3339 UTC Z instant at which this immutable withdrawal event occurred. */
            occurredAt: components["schemas"]["UtcInstant"];
            /** @description Non-negative integer KRW held by this Wish immediately after the withdrawal. */
            wishAmountAfter: components["schemas"]["KrwNonNegative"];
            /** @description Negative integer KRW removed from this Wish. */
            wishAmountDelta: components["schemas"]["KrwSigned"] & unknown;
            /** @description Immutable purpose captured for this Wish by the ledger effect when the event occurred. */
            wishPurposeSnapshot: components["schemas"]["Purpose"];
        };
    };
    responses: {
        /** @description ACADEMY_NOT_FOUND — absent or currently invisible academy is hidden. */
        AcademyNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description AUTH_REQUIRED — missing or invalid bearer token. */
        AuthRequired: {
            headers: {
                "WWW-Authenticate": "Bearer";
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description BALANCE_SYNC_FAILED — retryable external balance query failure; the failed observation is persisted without mutating the Wish. */
        BalanceSyncFailed: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description CARD_BALANCE_ACCOUNT_NOT_FOUND — an absent, closed, non-owned, or cross-academy account is hidden. */
        CardBalanceAccountNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description BALANCE_MISMATCH_LOCKED or IDEMPOTENCY_KEY_REUSED. A matching successful idempotent replay is resolved before the current mismatch guard. */
        CreateConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, or IDEMPOTENCY_KEY_REUSED. An open mismatch does not block deletion. */
        DeleteConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description MALFORMED_REQUEST, EXPECTED_VERSION_REQUIRED, or IDEMPOTENCY_KEY_REQUIRED. */
        DeletePreconditionRequired: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, BALANCE_MISMATCH_LOCKED, INSUFFICIENT_AVAILABLE_BALANCE, TARGET_AMOUNT_EXCEEDED, or IDEMPOTENCY_KEY_REUSED. */
        DepositConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description FORBIDDEN — the authenticated principal is not a student. */
        Forbidden: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_AMOUNT — decoded integer amount is non-positive or out of range. */
        InvalidAmount: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_AMOUNT or INVALID_PURPOSE — an independently decoded field violates its constraint. */
        InvalidAmountOrPurpose: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_AMOUNT or INVALID_VERSION — an independently decoded amount or expectedVersion violates its constraint. */
        InvalidAmountOrVersion: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_AMOUNT, INVALID_PURPOSE, or INVALID_VERSION — an independently decoded field violates its constraint. */
        InvalidAmountPurposeOrVersion: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_VERSION — a decoded negative If-Match value violates the non-negative version constraint. */
        InvalidIfMatchVersion: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_AMOUNT or INVALID_VERSION — an independently decoded amount or source/destination version violates its constraint. */
        InvalidTransferAmountOrVersion: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description INVALID_VERSION — a decoded negative expectedVersion violates the non-negative version constraint. */
        InvalidVersion: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description MALFORMED_REQUEST, including a missing or non-integer required version, or IDEMPOTENCY_KEY_REQUIRED. */
        MalformedOrIdempotencyRequired: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description MALFORMED_REQUEST — malformed JSON, path, query, cursor, or required concurrency structure, including a missing or non-integer required version. */
        MalformedRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, or BALANCE_MISMATCH_LOCKED. */
        PatchConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description ACADEMY_NOT_FOUND or SHARED_CARD_NOT_FOUND — absence or current visibility failure is hidden. */
        SharedCardOrAcademyNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, or IDEMPOTENCY_KEY_REUSED. An open mismatch does not block completion or abandonment. */
        StateMutationConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, CROSS_ACCOUNT_TRANSFER_FORBIDDEN, INSUFFICIENT_WISH_AMOUNT, TARGET_AMOUNT_EXCEEDED, BALANCE_MISMATCH_LOCKED, or IDEMPOTENCY_KEY_REUSED. */
        TransferConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description UNSUPPORTED_MEDIA_TYPE — PATCH requires application/merge-patch+json. */
        UnsupportedMediaType: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description CARD_BALANCE_ACCOUNT_NOT_FOUND or WISH_NOT_FOUND — the account is absent or non-owned, or the Wish is absent, foreign, or outside that account. An owned tombstoned Wish is intentionally not hidden by this history-specific response and returns 200. */
        WishHistoryOrAccountNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description Wish mutation completed; identical replay returns the original status and body. */
        WishMutationSuccess: {
            headers: {
                "Idempotency-Replayed": components["headers"]["IdempotencyReplayed"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["WishMutationResult"];
            };
        };
        /** @description CARD_BALANCE_ACCOUNT_NOT_FOUND or WISH_NOT_FOUND — absence, non-ownership, deletion, or hidden state. */
        WishOrAccountNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description VERSION_CONFLICT, INVALID_STATE_TRANSITION, INSUFFICIENT_WISH_AMOUNT, or IDEMPOTENCY_KEY_REUSED. */
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
        /** @description Opaque cursor tied to the endpoint's fixed ordering. */
        Cursor: components["schemas"]["Cursor"];
        /** @description Permanent per-student namespace; reuse is valid only for the same operation, target, and canonical request. */
        IdempotencyKey: string;
        /** @description Exact non-negative integer Wish version for bodyless DELETE concurrency. A missing or non-integer value remains 400; a decoded negative value returns 422 INVALID_VERSION; a stale non-negative value returns 409 VERSION_CONFLICT. */
        IfMatch: components["schemas"]["WishVersion"];
        Limit: number;
        SharedCardId: components["schemas"]["Uuid"];
        WishId: components["schemas"]["Uuid"];
    };
    requestBodies: never;
    headers: {
        /** @description True only when the original status and body are replayed for an identical request. */
        IdempotencyReplayed: boolean;
    };
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listAcademySharedCards: {
        parameters: {
            query?: {
                /** @description Opaque cursor tied to the endpoint's fixed ordering. */
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
            /** @description Currently visible progress and completion cards. */
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
            /** @description One currently visible Shared Card. */
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
            /** @description Current persisted Card Balance Account projection. */
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
            /** @description A successful current balance observation. */
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
                /** @description Opaque cursor tied to the endpoint's fixed ordering. */
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
            /** @description Immutable nonzero card-balance event history. */
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
                /** @description Opaque cursor tied to the endpoint's fixed ordering. */
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
            /** @description Account fund movement history. */
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
    transferWishFunds: {
        parameters: {
            query?: never;
            header: {
                /** @description Permanent per-student namespace; reuse is valid only for the same operation, target, and canonical request. */
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
            /** @description Atomic transfer completed; identical replay returns the original status and body. */
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
                /** @description Opaque cursor tied to the endpoint's fixed ordering. */
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
            /** @description A page of non-deleted Wishes. */
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
                /** @description Permanent per-student namespace; reuse is valid only for the same operation, target, and canonical request. */
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
            /** @description Wish created; identical replay returns the original status and body. */
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
            /** @description The Wish. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Wish"];
                };
            };
            401: components["responses"]["AuthRequired"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["WishOrAccountNotFound"];
        };
    };
    deleteWish: {
        parameters: {
            query?: never;
            header: {
                /** @description Permanent per-student namespace; reuse is valid only for the same operation, target, and canonical request. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description Exact non-negative integer Wish version for bodyless DELETE concurrency. A missing or non-integer value remains 400; a decoded negative value returns 422 INVALID_VERSION; a stale non-negative value returns 409 VERSION_CONFLICT. */
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
            /** @description The atomically updated Wish. */
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
                /** @description Permanent per-student namespace; reuse is valid only for the same operation, target, and canonical request. */
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
            422: components["responses"]["InvalidVersion"];
        };
    };
    completeWish: {
        parameters: {
            query?: never;
            header: {
                /** @description Permanent per-student namespace; reuse is valid only for the same operation, target, and canonical request. */
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
            422: components["responses"]["InvalidVersion"];
        };
    };
    depositToWish: {
        parameters: {
            query?: never;
            header: {
                /** @description Permanent per-student namespace; reuse is valid only for the same operation, target, and canonical request. */
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
                /** @description Opaque cursor tied to the endpoint's fixed ordering. */
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
            /** @description Wish fund movement history. */
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
                /** @description Permanent per-student namespace; reuse is valid only for the same operation, target, and canonical request. */
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
            /** @description Visible Card Balance Accounts. */
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
}
