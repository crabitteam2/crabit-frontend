export interface CardAccount {
  id: string;
  name: string;
  balance: number;
  cardNumber: string;
}

const accounts: CardAccount[] = [
  {
    id: "a1",
    name: "크래빗 카드 사용가능 금액",
    balance: 20_000,
    cardNumber: "0000-0000-0000-0000",
  },
];

type SearchParams = Record<string, string | string[] | undefined>;

export function resolveCardAccounts(params: SearchParams): CardAccount[] {
  const raw = params.accounts;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "empty") return [];
  return accounts;
}
