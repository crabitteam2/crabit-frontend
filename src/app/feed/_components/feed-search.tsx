"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import chipCloseIcon from "@/../public/images/feed/chip-close.svg";
import searchIcon from "@/../public/images/feed/search.svg";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { createBrowserApiClient } from "@/lib/http/browser";
import { searchAcademyStudents } from "@/lib/http/follows";
import type { components } from "@/lib/http/generated/crabit-backend";
import { useBehaviorSession } from "./behavior-session";
import {
  readRecentSearches,
  saveRecentSearches,
  withRecentSearch,
} from "./recent-search-storage";

const DEBOUNCE_MS = 250;

const PAGE_LIMIT = 20;

type Student = components["schemas"]["StudentRelationship"];

const CHIP_STYLE =
  "border-gray-7 text-gray-7 flex shrink-0 items-center gap-[7px] rounded-[15px] border px-[10px] py-[6px] text-b4";

export function FeedSearch() {
  const router = useRouter();
  const session = useBehaviorSession();
  const client = useMemo(() => createBrowserApiClient(), []);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [results, setResults] = useState<Student[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const version = useRef(0);

  useEffect(() => setRecent(readRecentSearches()), []);

  useEffect(() => {
    const academyId = session?.context.academyId;
    const nickname = query.trim();
    if (academyId === undefined || nickname === "") {
      setResults([]);
      setHasError(false);
      return;
    }

    const current = ++version.current;
    const timer = setTimeout(async () => {
      const result = await searchAcademyStudents(client, {
        academyId,
        nickname,
        limit: PAGE_LIMIT,
      });
      if (version.current !== current) return;

      setHasError(!result.ok);
      setResults(result.ok ? result.data.items : []);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [client, query, session?.context.academyId]);

  const remember = (keywords: string[]) => {
    setRecent(keywords);
    saveRecentSearches(keywords);
  };

  const cancel = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/feed");
  };

  const visit = (studentId: string, nickname: string) => {
    remember(withRecentSearch(recent, nickname));
    const academyId = session?.context.academyId;
    router.push(
      academyId === undefined
        ? `/feed/${studentId}`
        : `/feed/${studentId}?academyId=${encodeURIComponent(academyId)}`,
    );
  };

  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-5">
        <div className="bg-pink-1 flex min-w-0 flex-1 items-center rounded-[10px] p-2">
          <Image
            src={searchIcon}
            alt=""
            width={32}
            height={32}
            className="shrink-0"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="검색할 학생를 입력해주세요."
            aria-label="학생 검색"
            className="text-fg-neutral placeholder:text-gray-5 min-w-0 flex-1 bg-transparent pl-4 text-[16px] leading-[23px] tracking-[-0.3px] outline-none"
          />
        </div>
        <button
          type="button"
          onClick={cancel}
          className="text-gray-7 shrink-0 pl-4 text-[16px] leading-[23px] font-medium tracking-[-0.3px]"
        >
          취소
        </button>
      </header>

      {hasError ? (
        <p
          role="alert"
          className="text-gray-7 px-4 pb-10 text-center text-[16px] leading-[23px] font-medium tracking-[-0.3px]"
        >
          검색하지 못했어요. 잠시 후 다시 시도해주세요.
        </p>
      ) : null}

      {results.length === 0 ? null : (
        <section>
          <h2 className="text-t1 text-fg-neutral px-4 pt-3 pb-2 font-bold">
            학생
          </h2>
          <div className="px-4 pb-10">
            <div className="bg-pink-1 flex items-center gap-3 overflow-x-auto rounded-[15px] p-4">
              {results.map((student) => (
                <button
                  key={student.studentId}
                  type="button"
                  onClick={() => visit(student.studentId, student.nickname)}
                  className={CHIP_STYLE}
                >
                  {student.nickname}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-end justify-between px-4 pt-3 pb-2">
          <h2 className="text-t1 text-fg-neutral font-bold">최근 검색</h2>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="text-gray-7 text-b4 font-medium"
          >
            전체삭제
          </button>
        </div>

        <div className="px-4 pb-10">
          {recent.length === 0 ? (
            <p className="bg-pink-1 text-gray-7 rounded-[15px] p-9 text-center text-[16px] leading-[23px] font-medium tracking-[-0.3px]">
              검색 내역이 없어요.
            </p>
          ) : (
            <div className="bg-pink-1 flex items-center gap-3 overflow-x-auto rounded-[15px] px-4 py-9">
              {recent.map((keyword) => (
                <span key={keyword} className={CHIP_STYLE}>
                  <button
                    type="button"
                    onClick={() => setQuery(keyword)}
                    className="whitespace-nowrap"
                  >
                    {keyword}
                  </button>
                  <button
                    type="button"
                    aria-label={`${keyword} 검색어 삭제`}
                    onClick={() =>
                      remember(recent.filter((item) => item !== keyword))
                    }
                    className="block size-2"
                  >
                    <Image src={chipCloseIcon} alt="" width={8} height={8} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="최근 검색 내역을 모두 삭제할까요?"
        primaryLabel="삭제하기"
        secondaryLabel="취소하기"
        onPrimary={() => {
          remember([]);
          setIsDeleteOpen(false);
        }}
        onSecondary={() => setIsDeleteOpen(false)}
        onDismiss={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
