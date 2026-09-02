"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardBalanceCard } from "./card-balance-card";
import type { WishItem } from "./wish-item";
import { WishSourceCard } from "./wish-source-card";

const TABS = ["내 카드", "내 위시"] as const;
const SELECT_DELAY_MS = 200;

type AccountTab = (typeof TABS)[number];

interface Selection {
  id: string;
  label: string;
}

/** 상대로 고를 수 있는 카드 잔액입니다. */
export interface SelectableCard {
  /** 다음 화면에 넘길 카드 식별자입니다. */
  id: string;
  /** 카드 잔액 칸에 붙는 이름입니다. */
  name: string;
  /** 카드 번호 표기입니다. */
  cardNumber: string;
  /** 쓸 수 있는 카드 잔액이며, 아직 조회하지 못했으면 null입니다. */
  balance: number | null;
}

interface AccountSelectProps {
  nextPath: string;
  paramName: string;
  card: SelectableCard;
  canSelectCard?: boolean;
  wishes: WishItem[];
}

export function AccountSelect({
  nextPath,
  paramName,
  card,
  canSelectCard = true,
  wishes,
}: AccountSelectProps) {
  const router = useRouter();
  const [tab, setTab] = useState<AccountTab>("내 카드");
  const [selected, setSelected] = useState<Selection | null>(null);

  const select = (choice: Selection) => {
    if (selected !== null) return;
    setSelected(choice);
    setTimeout(() => {
      router.push(`${nextPath}?${paramName}=${choice.id}`);
    }, SELECT_DELAY_MS);
  };

  const switchTab = (next: AccountTab) => {
    setSelected(null);
    setTab(next);
  };

  return (
    <>
      <div className="px-4">
        <p className="border-stroke-neutral-solid text-fg-neutral-subtle flex h-11 items-center border-b-2 text-[16px] leading-[23px] tracking-[-0.3px]">
          {selected?.label ?? ""}
        </p>
      </div>

      <div
        role="tablist"
        aria-label="돈 보낼 대상"
        className="flex gap-4 px-4 pt-[26.25px] pb-[26.25px]"
      >
        {TABS.map((item) => (
          <Button
            key={item}
            role="tab"
            aria-selected={item === tab}
            variant={item === tab ? "fill" : "weak"}
            size="large"
            onClick={() => switchTab(item)}
            className="flex-1"
          >
            {item}
          </Button>
        ))}
      </div>

      {tab === "내 위시" && wishes.length === 0 ? null : (
        <ul className="flex flex-col gap-10 px-4 pb-10">
          {tab === "내 카드" ? (
            <li>
              <button
                type="button"
                aria-label={`${card.name} 선택`}
                disabled={!canSelectCard}
                onClick={() => select({ id: card.id, label: card.cardNumber })}
                className="block w-full text-left disabled:cursor-not-allowed"
              >
                <CardBalanceCard
                  name={card.name}
                  cardNumber={card.cardNumber}
                  balance={card.balance}
                  isSelected={selected?.id === card.id}
                />
              </button>
              {canSelectCard ? null : (
                <p className="text-e1 text-gray-5 px-1 pt-3">
                  화면을 당겨서 새로고침하면 잔액을 다시 확인해요.
                </p>
              )}
            </li>
          ) : (
            wishes.map((wish) => (
              <li key={wish.id}>
                <button
                  type="button"
                  aria-label={`${wish.purpose} 선택`}
                  onClick={() => select({ id: wish.id, label: wish.purpose })}
                  className="block w-full text-left"
                >
                  <WishSourceCard
                    wish={wish}
                    isSelected={selected?.id === wish.id}
                  />
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </>
  );
}
