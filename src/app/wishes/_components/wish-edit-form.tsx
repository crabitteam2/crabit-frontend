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
import {
  fromPeriodLabel,
  toIsoDate,
  toPeriodLabel,
} from "./wish-period-format";

interface WishEditFormProps {
  backHref: string;
  donePath: string;
  purpose: string;
  targetAmount: number;
  period: string | null;
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
  cardBalanceAccountId,
  wishId,
  version,
  photo,
}: WishEditFormProps) {
  const router = useRouter();
  const [client] = useState(() => createBrowserApiClient());
  const scope = `edit:${wishId}`;
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [nextPurpose, setNextPurpose] = useState("");
  const [nextAmount, setNextAmount] = useState("");
  const [range, setRange] = useState(() => fromPeriodLabel(period));
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

  const digits = nextAmount.replace(/\D/g, "");
  const amount = digits === "" ? 0 : Number(digits);
  const nextPeriod = toPeriodLabel(range);
  const displayedPhotoUrl = removeCurrentPhoto
    ? null
    : (previewUrl ??
      pendingPhoto?.variants.medium ??
      photo?.variants.medium ??
      null);
  const isSkippingPeriod = isCalendarOpen && range.start === null;
  const canSubmit =
    nextPurpose.trim() !== "" ||
    amount > 0 ||
    nextPeriod !== (period ?? "") ||
    selectedPhoto !== null ||
    pendingPhoto !== null ||
    removeCurrentPhoto;

  useEffect(() => {
    setPendingPhoto(readWishPhotoUploadState(scope).pendingPhoto);
  }, [scope]);

  useEffect(() => {
    if (previewUrl === null) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const submit = async () => {
    if (isCalendarOpen) {
      setIsCalendarOpen(false);
      return;
    }
    if (!canSubmit || isSubmitting) return;
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
        ...(nextPurpose.trim() === "" ? {} : { purpose: nextPurpose }),
        ...(amount === 0 ? {} : { targetAmount: amount }),
        ...(nextPeriod === (period ?? "")
          ? {}
          : {
              startDate: toIsoDate(range.start),
              targetDate: toIsoDate(range.end),
            }),
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
      setIsSubmitting(false);
    }
  };

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
    if (file === undefined) return;
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
    <div
      className={
        isKeyboardOpen
          ? "max-w-app fixed inset-x-0 z-10 mx-auto flex w-full flex-col bg-white"
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

      {isCalendarOpen ? null : (
        <>
          <div className="flex flex-col items-center gap-3 px-4 pb-5">
            {displayedPhotoUrl === null ? (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="bg-brand-weak text-fg-brand flex size-24 items-center justify-center rounded-full font-semibold"
              >
                사진 추가
              </button>
            ) : (
              <button
                type="button"
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
            {photo !== null || previewUrl !== null || pendingPhoto !== null ? (
              <button
                type="button"
                onClick={() => void removePhoto()}
                className="text-e1 text-error"
              >
                사진 삭제
              </button>
            ) : null}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void pickPhoto(event.target.files?.[0])}
            />
          </div>
          <div className="px-4 pt-5 pb-[76px]">
            <Input
              label="위시"
              variant="filled"
              placeholder={purpose}
              value={nextPurpose}
              onChange={(event) => setNextPurpose(event.target.value)}
            />
          </div>

          <div className="px-4 py-5">
            <Input
              label="위시 금액"
              variant="filled"
              inputMode="numeric"
              placeholder={`${targetAmount.toLocaleString("ko-KR")}원`}
              value={digits === "" ? "" : amount.toLocaleString("ko-KR")}
              onChange={(event) => setNextAmount(event.target.value)}
            />
          </div>
        </>
      )}

      <div className={`px-4 py-5 ${isCalendarOpen ? "pt-5" : ""}`}>
        <Input
          label="위시 기간"
          variant="filled"
          readOnly
          value={nextPeriod}
          placeholder="설정된 기간 없음"
          onFocus={() => setIsCalendarOpen(true)}
          onClick={() => setIsCalendarOpen(true)}
        />
      </div>

      {isCalendarOpen ? (
        <div className="px-[10px]">
          <Calendar value={range} onChange={setRange} />
        </div>
      ) : null}

      {error === null ? null : (
        <p role="alert" className="text-fg-error px-4 pt-4 text-sm">
          {error}
        </p>
      )}

      <div className="flex-1" />

      <div
        className={`px-4 ${isKeyboardOpen ? "pb-5" : "pb-[calc(55px+env(safe-area-inset-bottom))]"}`}
      >
        <Button
          size="xlarge"
          variant={isSkippingPeriod ? "weak" : "fill"}
          className="w-full"
          disabled={!isCalendarOpen && !canSubmit}
          isLoading={isSubmitting}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => void submit()}
        >
          {isSkippingPeriod ? "넘어가기" : "다음"}
        </Button>
      </div>
    </div>
  );
}
