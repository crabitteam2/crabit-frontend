"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import placeholderIcon from "@/../public/images/wishes/image-placeholder.svg";
import { ScreenHeader } from "@/app/wishes/_components/screen-header";
import { Button } from "@/components/ui/button";
import {
  clampTransform,
  displayedSize,
  initialTransform,
  panBy,
  toCropRect,
  zoomAt,
  type CropTransform,
  type PhotoSize,
} from "./photo-crop";
import { useWishForm } from "@/lib/forms/use-wish-form";
import { clearNewWishPhoto, saveNewWishPhoto } from "./photo-storage";

const TAP_SLOP = 8;
const MAX_EXPORT_SIZE = 1080;

interface WishPhotoFormProps {
  backHref: string;
  nextPath: string;
  query: string;
}

interface Point {
  x: number;
  y: number;
}

function midpoint(points: Point[]): Point {
  const [first, second] = points;
  if (first === undefined) return { x: 0, y: 0 };
  if (second === undefined) return first;
  return { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
}

function distance(points: Point[]) {
  const [first, second] = points;
  if (first === undefined || second === undefined) return 0;
  return Math.hypot(first.x - second.x, first.y - second.y);
}

export function WishPhotoForm({
  backHref,
  nextPath,
  query,
}: WishPhotoFormProps) {
  const router = useRouter();
  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useWishForm<{ photo: File | null }>({ defaultValues: { photo: null } });
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<{ distance: number; center: Point } | null>(null);
  const drift = useRef(0);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photo, setPhoto] = useState<PhotoSize | null>(null);
  const [box, setBox] = useState(0);
  const [transform, setTransform] = useState<CropTransform>({
    scale: 1,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (previewUrl === null) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    const element = boxRef.current;
    if (element === null) return;

    const sync = () => setBox(element.getBoundingClientRect().width);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(element);
    return () => observer.disconnect();
  }, [previewUrl]);

  useEffect(() => {
    if (photo === null || box === 0) return;
    setTransform(initialTransform(box, photo));
  }, [photo, box]);

  const openPicker = () => inputRef.current?.click();

  const pick = (file: File | undefined) => {
    if (file === undefined) return;
    setValue("photo", file, { shouldDirty: true });
    setPhoto(null);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const localPoint = (event: PointerEvent<HTMLDivElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, localPoint(event));
    drift.current = 0;

    const points = [...pointers.current.values()];
    pinch.current =
      points.length >= 2
        ? { distance: distance(points), center: midpoint(points) }
        : null;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    if (photo === null || box === 0) return;

    const previous = pointers.current.get(event.pointerId) as Point;
    const current = localPoint(event);
    pointers.current.set(event.pointerId, current);
    drift.current += Math.hypot(current.x - previous.x, current.y - previous.y);

    const points = [...pointers.current.values()];
    if (points.length >= 2 && pinch.current !== null) {
      const nextDistance = distance(points);
      const nextCenter = midpoint(points);
      if (pinch.current.distance > 0 && nextDistance > 0) {
        const ratio = nextDistance / pinch.current.distance;
        setTransform((value) => {
          const moved = panBy(
            value,
            nextCenter.x - (pinch.current?.center.x ?? nextCenter.x),
            nextCenter.y - (pinch.current?.center.y ?? nextCenter.y),
            box,
            photo,
          );
          return zoomAt(
            moved,
            moved.scale * ratio,
            nextCenter.x,
            nextCenter.y,
            box,
            photo,
          );
        });
      }
      pinch.current = { distance: nextDistance, center: nextCenter };
      return;
    }

    setTransform((value) =>
      panBy(value, current.x - previous.x, current.y - previous.y, box, photo),
    );
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size > 0) return;
    if (drift.current <= TAP_SLOP) openPicker();
  };

  const submit = handleSubmit(() => {
    const image = imageRef.current;
    if (image === null || photo === null || box === 0) {
      clearNewWishPhoto();
    } else {
      const rect = toCropRect(transform, box, photo);
      const output = Math.min(Math.round(rect.size), MAX_EXPORT_SIZE);
      const canvas = document.createElement("canvas");
      canvas.width = output;
      canvas.height = output;
      const context = canvas.getContext("2d");
      if (context === null) {
        clearNewWishPhoto();
      } else {
        context.drawImage(
          image,
          rect.sx,
          rect.sy,
          rect.size,
          rect.size,
          0,
          0,
          output,
          output,
        );
        saveNewWishPhoto(canvas.toDataURL("image/jpeg", 0.9));
      }
    }
    router.push(`${nextPath}?${query}`);
  });

  const size = photo === null ? null : displayedSize(transform, box, photo);
  const safeTransform =
    photo === null ? transform : clampTransform(transform, box, photo);

  return (
    <form onSubmit={submit} className="flex min-h-svh flex-col">
      <ScreenHeader
        title="사진을 업로드 할까요?"
        backHref={backHref}
        spacing="loose"
      />

      <div className="px-4">
        {previewUrl === null ? (
          <button
            type="button"
            onClick={openPicker}
            aria-label="위시 사진 선택"
            className="bg-pink-1 flex aspect-square w-full flex-col items-center overflow-hidden rounded-[20px] pt-[89px]"
          >
            <Image
              src={placeholderIcon}
              alt=""
              width={120}
              height={120}
              className="size-[120px] shrink-0"
            />
            <span className="text-gray-6 pt-5 text-[22px] leading-[30px] font-semibold tracking-[-0.3px]">
              위시 사진을 추가해보세요.
            </span>
          </button>
        ) : (
          <div
            ref={boxRef}
            role="button"
            tabIndex={0}
            aria-label="위시 사진 위치와 크기 조정"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPicker();
              }
            }}
            className="bg-pink-1 relative aspect-square w-full touch-none overflow-hidden rounded-[20px] select-none"
          >
            <Image
              ref={imageRef}
              src={previewUrl}
              alt="선택한 위시 사진"
              width={photo?.width ?? 1}
              height={photo?.height ?? 1}
              unoptimized
              draggable={false}
              onLoad={(event) =>
                setPhoto({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                })
              }
              className="max-w-none origin-top-left"
              style={
                size === null
                  ? { visibility: "hidden" }
                  : {
                      width: size.width / safeTransform.scale,
                      height: size.height / safeTransform.scale,
                      transform: `translate(${safeTransform.x}px, ${safeTransform.y}px) scale(${safeTransform.scale})`,
                    }
              }
            />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => pick(event.target.files?.[0])}
      />

      <div className="flex-1" />

      <div className="px-4 pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Button
          variant={previewUrl === null ? "weak" : "fill"}
          size="xlarge"
          className="w-full"
          type="submit"
          isLoading={isSubmitting}
        >
          {previewUrl === null ? "넘어가기" : "다음"}
        </Button>
      </div>
    </form>
  );
}
