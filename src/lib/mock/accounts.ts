export interface CardAccount {
  id: string;
  name: string;
  balance: number;
  cardNumber: string;
}

export const cardAccounts: CardAccount[] = [
  {
    id: "a1",
    name: "크래빗 카드 사용가능 금액",
    balance: 20_000,
    cardNumber: "0000-0000-0000-0000",
  },
];
