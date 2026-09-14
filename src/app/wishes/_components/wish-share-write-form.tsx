"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWishForm } from "@/lib/forms/use-wish-form";
import radioOffIcon from "@/../public/images/common/radio-off.svg";
import radioOnIcon from "@/../public/images/common/radio-on.svg";
import { Button } from "@/components/ui/button";
import { putShareTicket, type ShareVisibility } from "./share-ticket";

const VISIBILITIES = [
  { value: "ACADEMY", label: "학원 전체" },
  { value: "FOLLOWERS", label: "팔로워 공개" },
] as const;

interface WishShareWriteFormProps {
  /** 로딩 화면이 찾을 표의 이름입니다. */
  ticketName: string;
  donePath: string;
}

export function WishShareWriteForm({
  ticketName,
  donePath,
}: WishShareWriteFormProps) {
  const router = useRouter();
  const { watch, setValue, handleSubmit } = useWishForm<{
    visibility: ShareVisibility;
  }>({
    defaultValues: { visibility: "ACADEMY" },
  });
  const visibility = watch("visibility");
  const share = handleSubmit(({ visibility }) => {
    putShareTicket(ticketName, visibility);
    router.replace(donePath);
  });

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
        {VISIBILITIES.map((item) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={item.value === visibility}
            tabIndex={item.value === visibility ? 0 : -1}
            onKeyDown={(event) => {
              if (
                ![
                  "ArrowLeft",
                  "ArrowRight",
                  "ArrowUp",
                  "ArrowDown",
                  "Home",
                  "End",
                ].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? "ACADEMY"
                  : event.key === "End"
                    ? "FOLLOWERS"
                    : visibility === "ACADEMY"
                      ? "FOLLOWERS"
                      : "ACADEMY";
              setValue("visibility", next, { shouldDirty: true });
              const buttons =
                event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                  '[role="radio"]',
                );
              buttons?.[next === "ACADEMY" ? 0 : 1]?.focus();
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
          공유하기
        </Button>
      </div>
    </form>
  );
}
