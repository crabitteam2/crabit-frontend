import { WishProgressBar } from "./wish-progress-bar";
import { emptyWishTheme } from "./wish-theme";

interface EmptyWishCardProps {
  label: string;
}

export function EmptyWishCard({ label }: EmptyWishCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-[20px] ${emptyWishTheme.card}`}
    >
      <div className="flex flex-col gap-6 px-9 pt-7 pb-2">
        <p className="text-t3 text-fg-neutral h-7 truncate font-medium">
          {label}
        </p>
        <WishProgressBar percent={0} theme={emptyWishTheme} />
      </div>
    </article>
  );
}
