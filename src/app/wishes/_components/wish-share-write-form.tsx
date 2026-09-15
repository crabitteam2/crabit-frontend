"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWishForm } from "@/lib/forms/use-wish-form";
import radioOffIcon from "@/../public/images/common/radio-off.svg";
import radioOnIcon from "@/../public/images/common/radio-on.svg";
import { Button } from "@/components/ui/button";
import { putShareTicket, type ShareVisibility } from "./share-ticket";

const SHARED_VISIBILITIES = [
  { value: "ACADEMY", label: "학원 전체" },
  { value: "FOLLOWERS", label: "팔로워 공개" },
] as const;

const PRIVATE_VISIBILITY = { value: "PRIVATE", label: "비공개" } as const;

const MOVE_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

interface WishShareWriteFormProps {
  /** 로딩 화면이 찾을 표의 이름입니다. */
  ticketName: string;
  donePath: string;
  /** 처음 골라져 있을 공개 범위입니다. */
  initialVisibility: ShareVisibility;
  /** 비공개를 고를 수 있는지 여부이며, 이미 학원 피드에 올린 위시에서만 참입니다. */
  canUnshare?: boolean;
  submitLabel: string;
}

export function WishShareWriteForm({
  ticketName,
  donePath,
  initialVisibility,
  canUnshare = false,
  submitLabel,
}: WishShareWriteFormProps) {
  const router = useRouter();
  const options = canUnshare
    ? [...SHARED_VISIBILITIES, PRIVATE_VISIBILITY]
    : [...SHARED_VISIBILITIES];
  const { watch, setValue, handleSubmit } = useWishForm<{
    visibility: ShareVisibility;
  }>({
    defaultValues: { visibility: initialVisibility },
  });
  const visibility = watch("visibility");
  const share = handleSubmit(({ visibility }) => {
    putShareTicket(ticketName, visibility);
    router.replace(donePath);
  });

  const moveTo = (index: number, group: HTMLElement | null) => {
    const next = options[(index + options.length) % options.length];
    if (next === undefined) return;

    setValue("visibility", next.value, { shouldDirty: true });
    group
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [options.indexOf(next)]?.focus();
  };

  return (
    <form onSubmit={share}>
      <div className="flex items-start px-4 pt-5 pb-6">
        <h2 className="text-fg-neutral text-[24px] leading-7 font-semibold tracking-[-0.3px]">
          공개 대상
        </h2>
      </div>

      <div
        role="radiogroup"
        aria-label="공개 대상"
        className="flex flex-col px-4"
      >
        {options.map((item, index) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={item.value === visibility}
            tabIndex={item.value === visibility ? 0 : -1}
            onKeyDown={(event) => {
              const isMove =
                MOVE_KEYS.includes(event.key) ||
                event.key === "Home" ||
                event.key === "End";
              if (!isMove) return;
              event.preventDefault();

              const group = event.currentTarget.parentElement;
              if (event.key === "Home") return moveTo(0, group);
              if (event.key === "End") return moveTo(options.length - 1, group);

              const step =
                event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
              moveTo(index + step, group);
            }}
            onClick={() =>
              setValue("visibility", item.value, { shouldDirty: true })
            }
            className="flex items-center gap-3 text-left"
          >
            <Image
              src={item.value === visibility ? radioOnIcon : radioOffIcon}
              alt=""
              width={16}
              height={16}
              className="size-4 shrink-0"
            />
            <span className="text-fg-neutral text-[16px] leading-7 tracking-[-0.3px]">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="h-[calc(131px+env(safe-area-inset-bottom))]" />

      <div className="max-w-app fixed inset-x-0 bottom-0 z-10 mx-auto w-full bg-white px-4 pt-5 pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Button size="xlarge" className="w-full" type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
