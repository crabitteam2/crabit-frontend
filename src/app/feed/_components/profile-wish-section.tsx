"use client";

import { useState } from "react";
import { WISH_TONES } from "@/app/wishes/_components/wish-theme";
import { Button } from "@/components/ui/button";
import type { ProfileWishItem } from "./feed-item";
import { ProfileWishCard } from "./profile-wish-card";

const FULL_LIST_MAX = 3;

const COLLAPSED_SHOWN = 2;

const MORE_STEP = 2;

function toInitialShown(total: number) {
  return total <= FULL_LIST_MAX ? total : COLLAPSED_SHOWN;
}

interface ProfileWishSectionProps {
  title: string;
  wishes: ProfileWishItem[];
}

export function ProfileWishSection({ title, wishes }: ProfileWishSectionProps) {
  const [shown, setShown] = useState(toInitialShown(wishes.length));

  return (
    <section>
      <h2 className="text-t1 text-fg-neutral px-4 pt-8 pb-4 font-bold">
        {title}
      </h2>
      {wishes.length === 0 ? (
        <div className="h-[226px]" />
      ) : (
        <ul className="flex flex-col gap-10 px-4 pb-10">
          {wishes.slice(0, shown).map((wish, index) => (
            <li key={wish.id}>
              <ProfileWishCard
                wish={wish}
                tone={WISH_TONES[index % WISH_TONES.length]}
              />
            </li>
          ))}
        </ul>
      )}
      {shown < wishes.length ? (
        <div className="px-4 pb-10">
          <Button
            variant="weak"
            color="dark"
            size="xlarge"
            className="w-full"
            onClick={() => setShown((count) => count + MORE_STEP)}
          >
            더보기
          </Button>
        </div>
      ) : null}
    </section>
  );
}
