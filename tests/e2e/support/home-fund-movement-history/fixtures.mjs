export const accountId = "11111111-1111-4111-8111-111111111111";
export const account = { cardBalanceAccountId: accountId, academyId: "22222222-2222-4222-8222-222222222222", balanceKnowledge: "KNOWN", actualCardBalance: 30000, ledgerAvailableBalance: 22000, displayAvailableBalance: 22000, unresolvedShortage: 0, lastRefreshStatus: "SUCCESS", lastRefreshedAt: "2026-09-16T00:00:00Z", balanceAdjustmentInProgress: false };
const wish = (name, deleted = false) => ({ wishId: "33333333-3333-4333-8333-333333333333", wishPurposeSnapshot: name, deletedWish: deleted, detailAvailable: !deleted });
const common = { correctionOfEventId: null, balanceAdjustment: null, occurredAt: "2026-09-16T00:00:00Z", accountAvailableBalanceAfter: 25000, accountAvailableBalanceDelta: 5000 };
export const events = [
 { ...common, eventId: "decrease", eventType: "CARD_BALANCE_CHANGE", actualCardBalanceDelta: -5000, actualCardBalanceAfter: 5000, accountAvailableBalanceDelta: -5000, accountAvailableBalanceAfter: -2000, lookupMethod: "USER_REQUESTED", observationId: "obs" },
 { ...common, eventId: "transfer", eventType: "WISH_TRANSFER", amount: 2000, accountAvailableBalanceDelta: 0, accountAvailableBalanceAfter: 22000, sourceWish: wish("여름 자전거"), destinationWish: wish("여름 운동화") },
 ...["WISH_DEPOSIT", "WISH_WITHDRAWAL", "WISH_COMPLETION_RETURN", "WISH_ABANDONMENT_RETURN", "WISH_DELETION_RETURN"].map((eventType, i) => ({ ...common, eventId: `wish-${i}`, eventType, wish: wish(i === 4 ? "삭제된 옛 위시" : "여름 자전거", i === 4), accountAvailableBalanceDelta: i === 0 ? -5000 : 5000 })),
];
export const oldEvent = { ...events[2], eventId: "old", occurredAt: "2024-01-01T00:00:00Z", wish: wish("오래된 피아노와 아주아주아주아주아주아주아주 긴 역사적 위시 이름"), accountAvailableBalanceDelta: -999999999, accountAvailableBalanceAfter: 123456789 };
