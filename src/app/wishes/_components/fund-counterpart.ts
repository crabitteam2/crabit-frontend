/** 돈이 드나드는 상대이며 카드 잔액이거나 같은 계좌의 다른 위시입니다. */
export type FundCounterpartRef =
  | { readonly kind: "card" }
  | {
      /** 상대가 같은 계좌의 다른 위시임을 뜻합니다. */
      readonly kind: "wish";
      /** 상대 위시 식별자입니다. */
      readonly wishId: string;
      /** 이체 요청에 함께 보낼 상대 위시의 기대 버전입니다. */
      readonly version: number;
      /** 완료 화면 문구에 쓰는 상대 위시 이름입니다. */
      readonly purpose: string;
    };
