"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdjustCardSummary } from "./adjust-card-summary";
import { AdjustSourceCard } from "./adjust-source-card";

export interface AdjustWish {
  id: string;
  label: string;
  amount: number;
  percent: number;
}

export interface AdjustCard {
  label: string;
  balance: number;
  shortage: number;
  cardNumber: string;
}

interface AdjustWishListProps {
  card: AdjustCard;
  wishes: AdjustWish[];
}

export function AdjustWishList({ card, wishes }: AdjustWishListProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="px-4 pb-[60px]">
          <AdjustCardSummary {...card} />
        </div>

        <h2 className="text-t1 text-fg-neutral px-4 pb-4 font-bold">
          출금할 위시를 선택해주세요.
        </h2>

        <ul className="flex flex-col gap-10 px-4 pb-10">
          {wishes.map((wish) => (
            <li key={wish.id}>
              <button
                type="button"
                aria-pressed={selected === wish.id}
                aria-label={`${wish.label} 선택`}
                onClick={() => setSelected(wish.id)}
                className="block w-full text-left"
              >
                <AdjustSourceCard
                  label={wish.label}
                  amount={wish.amount}
                  percent={wish.percent}
                  isSelected={selected === wish.id}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-4 pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Button
          size="xlarge"
          className="w-full"
          disabled={selected === null}
          onClick={() => router.push(`/adjust/${selected}/amount`)}
        >
          다음
        </Button>
      </div>
    </>
  );
}
