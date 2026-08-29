"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import chipCloseIcon from "@/../public/images/feed/chip-close.svg";
import searchIcon from "@/../public/images/feed/search.svg";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { searchStudents } from "@/lib/mock/feed";

const CHIP_STYLE =
  "border-gray-7 text-gray-7 flex shrink-0 items-center gap-[7px] rounded-[15px] border px-[10px] py-[6px] text-b4";

interface FeedSearchProps {
  recentSearches: string[];
}

export function FeedSearch({ recentSearches }: FeedSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(recentSearches);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const results = searchStudents(query);

  const visit = (studentId: string, nickname: string) => {
    setRecent((keywords) => [
      nickname,
      ...keywords.filter((keyword) => keyword !== nickname),
    ]);
    router.push(`/feed/${studentId}`);
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
            placeholder="검색할 친구를 입력해주세요."
            aria-label="학생 검색"
            className="text-fg-neutral placeholder:text-gray-5 min-w-0 flex-1 bg-transparent pl-4 text-[16px] leading-[23px] tracking-[-0.3px] outline-none"
          />
        </div>
        <Link
          href="/feed"
          className="text-gray-7 shrink-0 pl-4 text-[16px] leading-[23px] font-medium tracking-[-0.3px]"
        >
          취소
        </Link>
      </header>

      {results.length === 0 ? null : (
        <section>
          <h2 className="text-t1 text-fg-neutral px-4 pt-3 pb-2 font-bold">
            친구
          </h2>
          <div className="px-4 pb-10">
            <div className="bg-pink-1 flex items-center gap-3 overflow-x-auto rounded-[15px] p-4">
              {results.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => visit(student.id, student.nickname)}
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
                      setRecent((keywords) =>
                        keywords.filter((item) => item !== keyword),
                      )
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
          setRecent([]);
          setIsDeleteOpen(false);
        }}
        onSecondary={() => setIsDeleteOpen(false)}
        onDismiss={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
