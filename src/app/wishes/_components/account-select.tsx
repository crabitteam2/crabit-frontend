"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { CardAccount } from "@/lib/mock/accounts";
import type { Wish } from "@/lib/mock/wishes";
import { CardBalanceCard } from "./card-balance-card";
import { WishSourceCard } from "./wish-source-card";

const TABS = ["내 카드", "내 위시"] as const;
const SELECT_DELAY_MS = 200;

type AccountTab = (typeof TABS)[number];

interface Selection {
  id: string;
  label: string;
}

interface AccountSelectProps {
  nextPath: string;
  accounts: CardAccount[];
  wishes: Wish[];
}

export function AccountSelect({
  nextPath,
  accounts,
  wishes,
}: AccountSelectProps) {
  const router = useRouter();
  const [tab, setTab] = useState<AccountTab>("내 카드");
  const [selected, setSelected] = useState<Selection | null>(null);

  const select = (choice: Selection) => {
    if (selected !== null) return;
    setSelected(choice);
    setTimeout(() => {
      router.push(`${nextPath}?from=${choice.id}`);
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
          {tab === "내 카드"
            ? accounts.map((account) => (
                <li key={account.id}>
                  <button
                    type="button"
                    aria-label={`${account.name} 선택`}
                    onClick={() =>
                      select({ id: account.id, label: account.cardNumber })
                    }
                    className="block w-full text-left"
                  >
                    <CardBalanceCard
                      account={account}
                      isSelected={selected?.id === account.id}
                    />
                  </button>
                </li>
              ))
            : wishes.map((wish) => (
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
              ))}
        </ul>
      )}
    </>
  );
}
