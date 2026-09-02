"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  centeredSquareCrop,
  digestWishPhotoFile,
  renderWishPhotoJpeg,
} from "@/app/wishes/new/_components/photo-jpeg";
import {
  clearPendingWishPhoto,
  clearWishPhotoUploadState,
  readWishPhotoUploadState,
  savePendingWishPhoto,
  stableWishPhotoKey,
} from "@/app/wishes/new/_components/photo-storage";

import { useWishForm } from "@/lib/forms/use-wish-form";
import { formEnter } from "@/lib/forms/form-keyboard";
import {
  purposeError,
  amountError,
  periodError,
  normalizePurpose,
  parseKrw,
  formatKrw,
} from "@/lib/forms/wish-validation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useKeyboardViewport } from "@/hooks/use-keyboard-viewport";
import { createBrowserApiClient } from "@/lib/http/browser";
import type { components } from "@/lib/http/generated/crabit-backend";
import {
  deletePendingWishPhoto,
  uploadWishPhoto,
} from "@/lib/http/wish-photos";
import { patchWish } from "@/lib/http/wishes";
import { ScreenHeader } from "./screen-header";
import { fromPeriodLabel, toPeriodLabel } from "./wish-period-format";

interface WishEditFormProps {
  backHref: string;
  donePath: string;
  purpose: string;
  targetAmount: number;
  period: string | null;
  currentAmount?: number;
  cardBalanceAccountId: string;
  wishId: string;
  version: number;
  photo: components["schemas"]["WishPhoto"] | null;
}

export function WishEditForm({
  backHref,
  donePath,
  purpose,
  targetAmount,
  period,
  currentAmount = 0,
  cardBalanceAccountId,
  wishId,
  version,
  photo,
}: WishEditFormProps) {
  const router = useRouter();
  const [client] = useState(() => createBrowserApiClient());
  const scope = `edit:${wishId}`;
  const photoInputRef = useRef<HTMLInputElement>(null);
  const busy = useRef(false);
  const initialRange = fromPeriodLabel(period);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    setFocus,
    formState: { errors },
  } = useWishForm({
    defaultValues: {
      purpose,
      amount: formatKrw(String(targetAmount)),
      range: initialRange,
    },
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<
    components["schemas"]["WishPhoto"] | null
  >(null);
  const [removeCurrentPhoto, setRemoveCurrentPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const box = useKeyboardViewport();
  const isKeyboardOpen = box?.isKeyboardOpen ?? false;
  const values = watch();
  const range = values.range;
  const nextPeriod = toPeriodLabel(range);
  const displayedPhotoUrl = removeCurrentPhoto
    ? null
    : (previewUrl ??
      pendingPhoto?.variants.medium ??
      photo?.variants.medium ??
      null);
  const canSubmit =
    !purposeError(values.purpose) &&
    !amountError(values.amount, undefined, currentAmount) &&
    !periodError(range) &&
    (normalizePurpose(values.purpose) !== normalizePurpose(purpose) ||
      parseKrw(values.amount) !== targetAmount ||
      range.start !== initialRange.start ||
      range.end !== initialRange.end ||
      selectedPhoto !== null ||
      pendingPhoto !== null ||
      removeCurrentPhoto);
  useEffect(() => {
    setPendingPhoto(readWishPhotoUploadState(scope).pendingPhoto);
  }, [scope]);

  useEffect(() => {
    if (previewUrl === null) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const submit = handleSubmit(async (values) => {
    if (!canSubmit || busy.current) return;
    busy.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      let candidate = pendingPhoto;
      if (selectedPhoto !== null) {
        const bitmap = await createImageBitmap(selectedPhoto);
        const jpeg = await renderWishPhotoJpeg(
          bitmap,
          centeredSquareCrop(bitmap.width, bitmap.height),
        );
        bitmap.close();
        const upload = await uploadWishPhoto(client, {
          idempotencyKey: stableWishPhotoKey(
            scope,
            "upload",
            await digestWishPhotoFile(jpeg),
          ),
          photo: jpeg,
        });
        if (!upload.ok) {
          setError("새 사진을 업로드하지 못했어요. 다시 시도해주세요.");
          return;
        }
        candidate = upload.data;
        savePendingWishPhoto(scope, upload.data);
        setPendingPhoto(upload.data);
      }

      const body: components["schemas"]["WishMergePatch"] = {
        expectedVersion: version,
        ...(normalizePurpose(values.purpose) === normalizePurpose(purpose)
          ? {}
          : { purpose: normalizePurpose(values.purpose) }),
        ...(parseKrw(values.amount) === targetAmount
          ? {}
          : { targetAmount: parseKrw(values.amount)! }),
        ...(values.range.start === initialRange.start
          ? {}
          : { startDate: values.range.start?.replaceAll(".", "-") ?? null }),
        ...(values.range.end === initialRange.end
          ? {}
          : { targetDate: values.range.end?.replaceAll(".", "-") ?? null }),
        ...(removeCurrentPhoto
          ? { photoId: null }
          : candidate === null
            ? {}
            : { photoId: candidate.id }),
      };
      const patched = await patchWish(client, {
        cardBalanceAccountId,
        wishId,
        body,
      });
      if (!patched.ok) {
        setError(
          patched.error.code === "VERSION_CONFLICT"
            ? "다른 곳에서 위시가 변경됐어요. 화면을 새로고침해주세요."
            : "위시를 수정하지 못했어요. 기존 사진은 그대로 유지돼요.",
        );
        return;
      }

      clearWishPhotoUploadState(scope);
      router.push(donePath);
    } catch {
      setError("사진을 처리하지 못했어요. 기존 사진은 그대로 유지돼요.");
    } finally {
      busy.current = false;
      setIsSubmitting(false);
    }
  });

  const cancelPending = async () => {
    if (pendingPhoto === null) return true;
    const deleted = await deletePendingWishPhoto(client, {
      photoId: pendingPhoto.id,
    });
    if (!deleted.ok && deleted.error.status !== 404) {
      setError("이전에 업로드한 사진을 정리하지 못했어요.");
      return false;
    }
    clearPendingWishPhoto(scope);
    setPendingPhoto(null);
    return true;
  };

  const pickPhoto = async (file: File | undefined) => {
    if (file === undefined || busy.current) return;
    setError(null);
    if (!(await cancelPending())) return;
    setSelectedPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemoveCurrentPhoto(false);
  };

  const removePhoto = async () => {
    if (!(await cancelPending())) return;
    setSelectedPhoto(null);
    setPreviewUrl(null);
    setRemoveCurrentPhoto(true);
  };

  return (
    <form
      noValidate
      onSubmit={submit}
      onKeyDown={formEnter}
      className={
        isKeyboardOpen
          ? "max-w-app fixed inset-x-0 z-10 mx-auto flex w-full flex-col overflow-hidden bg-white [&>header]:shrink-0"
          : "flex min-h-svh flex-col"
      }
      style={
        isKeyboardOpen && box !== null
          ? { top: box.offsetTop, height: box.height }
          : undefined
      }
    >
      <ScreenHeader
        title="수정할 정보를 입력해주세요."
        backHref={backHref}
        spacing="loose"
      />

      <div
        className={
          isKeyboardOpen ? "min-h-0 flex-1 overflow-y-auto" : undefined
        }
      >
        {isCalendarOpen ? null : (
          <>
            <div className="flex flex-col items-center gap-3 px-4 pb-5">
              {displayedPhotoUrl === null ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => photoInputRef.current?.click()}
                  className="bg-brand-weak text-fg-brand flex size-24 items-center justify-center rounded-full font-semibold"
                >
                  사진 추가
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => photoInputRef.current?.click()}
                  aria-label="위시 사진 변경"
                >
                  <Image
                    src={displayedPhotoUrl}
                    alt="위시 사진"
                    width={96}
                    height={96}
                    unoptimized
                    className="size-24 rounded-full object-cover"
                  />
                </button>
              )}
              {photo !== null ||
              previewUrl !== null ||
              pendingPhoto !== null ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void removePhoto()}
                  className="text-e1 text-error"
                >
                  사진 삭제
                </button>
              ) : null}
              <input
                ref={photoInputRef}
                type="file"
                disabled={isSubmitting}
                accept="image/*"
                className="hidden"
                onChange={(event) => void pickPhoto(event.target.files?.[0])}
              />
            </div>
            <div className="px-4 pt-5 pb-[76px]">
              <Input
                label="위시"
                variant="filled"
                {...register("purpose", {
                  validate: (value) => purposeError(value) ?? true,
                })}
                type="text"
                enterKeyHint="next"
                onKeyDown={(event) =>
                  formEnter(event, () => setFocus("amount"))
                }
                error={errors.purpose?.message}
              />
            </div>

            <div className="px-4 py-5">
              <Input
                label="위시 금액"
                variant="filled"
                {...register("amount", {
                  validate: (value) =>
                    amountError(value, undefined, currentAmount) ?? true,
                  onBlur: () =>
                    setValue("amount", formatKrw(getValues("amount"))),
                })}
                type="text"
                inputMode="numeric"
                enterKeyHint="done"
                error={errors.amount?.message}
              />
            </div>
          </>
        )}

        <div className={`px-4 py-5 ${isCalendarOpen ? "pt-5" : ""}`}>
          <Input
            ref={
              register("range", {
                validate: (value) => periodError(value) ?? true,
              }).ref
            }
            error={errors.range?.message}
            label="위시 기간"
            variant="filled"
            readOnly
            inputMode="none"
            value={nextPeriod}
            placeholder="설정된 기간 없음"
            onClick={() => setIsCalendarOpen(true)}
            onKeyDown={(event) =>
              formEnter(event, () => setIsCalendarOpen(true))
            }
          />
        </div>

        {isCalendarOpen ? (
          <div className="px-[10px]">
            <Calendar
              value={range}
              onChange={(range) =>
                setValue("range", range, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>
        ) : null}
      </div>

      {error === null ? null : (
        <p role="alert" className="text-fg-error px-4 pt-4 text-sm">
          {error}
        </p>
      )}

      {isKeyboardOpen ? null : <div className="flex-1" />}

      <div
        className={`shrink-0 px-4 ${isKeyboardOpen ? "pb-5" : "pb-[calc(55px+env(safe-area-inset-bottom))]"}`}
      >
        <Button
          size="xlarge"
          variant={isCalendarOpen ? "weak" : "fill"}
          className="w-full"
          type={isCalendarOpen ? "button" : "submit"}
          onClick={isCalendarOpen ? () => setIsCalendarOpen(false) : undefined}
          isLoading={isSubmitting}
          disabled={
            !isCalendarOpen &&
            !canSubmit &&
            !purposeError(values.purpose) &&
            !amountError(values.amount, undefined, currentAmount)
          }
          onPointerDown={(event) => event.preventDefault()}
        >
          {isCalendarOpen ? "넘어가기" : "다음"}
        </Button>
      </div>
    </form>
  );
}
