"use client";
import Link from "next/link";
import Image from "next/image";
import heroImage from "@/../public/images/feed/profile-hero.png";
import searchIcon from "@/../public/images/feed/search.svg";
import arrowLeftIcon from "@/../public/images/wishes/arrow-left.svg";
import { useEffect, useState } from "react";
import type { components } from "@/lib/http/generated/crabit-backend";
import { behaviorRead, useBehaviorSession } from "./behavior-session";
import { SharedCard } from "./shared-card";
type Student = components["schemas"]["StudentRelationship"];
type Cards = components["schemas"]["SharedCardPage"];
export function RealProfile({ studentId }: { studentId: string }) {
  const session = useBehaviorSession();
  const [student, setStudent] = useState<Student | null>(null);
  const [cards, setCards] = useState<Cards | null>(null);
  const [error, setError] = useState(false);
  const [cardsError, setCardsError] = useState(false);
  useEffect(() => {
    if (!session) return;
    let active = true;
    setStudent(null);
    setCards(null);
    setError(false);
    setCardsError(false);
    const { context, entry } = session;
    behaviorRead<Student>(context, `students/${encodeURIComponent(studentId)}`)
      .then((value) => {
        if (!active) return;
        if (value.studentId !== studentId) throw new Error("Target mismatch");
        setStudent(value);
        if (!entry.submitted) {
          entry.submitted = true;
          entry.queue.offer("profile-visits", {
            eventId: entry.eventId,
            occurredAt: entry.occurredAt,
            targetStudentId: studentId,
          });
        }
        behaviorRead<Cards>(
          context,
          `shared-cards?ownerId=${encodeURIComponent(studentId)}&limit=20`,
        )
          .then((value) => {
            if (active) setCards(value);
          })
          .catch(() => {
            if (active) setCardsError(true);
          });
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [studentId, session?.entry]);
  return (
    <div>
      <div className="relative h-[348px] w-full overflow-hidden bg-gradient-to-b from-[#fcb1d6] to-[#f8f8f8]">
        <Image
          src={heroImage}
          alt=""
          width={320}
          height={320}
          priority
          className="absolute top-[73px] left-1/2 size-[320px] -translate-x-1/2 object-cover"
        />
        <header className="relative flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
          <Link
            href="/feed"
            aria-label="뒤로 가기"
            className="relative block size-8"
          >
            <Image src={arrowLeftIcon} alt="" fill sizes="32px" />
          </Link>
          <Link
            href="/feed/search"
            aria-label="학생 검색"
            className="block size-8"
          >
            <Image src={searchIcon} alt="" width={32} height={32} />
          </Link>
        </header>
      </div>
      {error ? (
        <p role="alert" className="p-6">
          이 학생의 프로필을 볼 수 없어요.
        </p>
      ) : !student ? (
        <p role="status" className="p-6">
          프로필을 불러오는 중이에요.
        </p>
      ) : (
        <>
          <div className="border-gray-3 border-b px-4 py-3">
            <h1 className="text-t1 font-bold">{student.nickname}</h1>
          </div>
          <h2 className="p-4 font-semibold">공유한 위시</h2>
          {cardsError ? (
            <p role="alert" className="p-4">
              공유한 위시를 불러오지 못했어요.
            </p>
          ) : !cards ? (
            <p role="status" className="p-4">
              위시를 불러오는 중이에요.
            </p>
          ) : cards.items.length ? (
            cards.items.map((card) => (
              <SharedCard
                key={card.sharedCardId}
                card={card}
                academyId={session!.context.academyId}
              />
            ))
          ) : (
            <p className="p-4">공유한 위시가 없어요.</p>
          )}
        </>
      )}
    </div>
  );
}
