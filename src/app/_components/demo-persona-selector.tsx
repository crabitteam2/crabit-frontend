"use client";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import type { DemoGradePersona, Persona } from "@/lib/persona/persona";
import { Spinner } from "@/components/ui/spinner";

/** Server supplies aliases only; credentials never cross the component boundary. */
export function DemoPersonaSelector({
  available,
  selected,
}: {
  available: readonly DemoGradePersona[];
  selected: Persona | null;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const switching = useRef(false);
  useEffect(() => {
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);
  async function select(persona: string) {
    if (switching.current) return;
    switching.current = true;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/demo/persona", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona }),
      });
      if (!response.ok) throw new Error("selection failed");
      window.location.replace("/demo");
    } catch {
      setError("대표를 변경하지 못했어요. 다시 시도해 주세요.");
      switching.current = false;
      setPending(false);
    }
  }
  return (
    <aside
      className="border-b border-gray-200 bg-white px-4 py-3"
      aria-label="데모 대표 선택"
    >
      <label className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        데모 대표
        <select
          aria-label="데모 대표"
          value={selected ?? ""}
          disabled={pending || available.length === 0}
          onChange={(event) => void select(event.target.value)}
          className="min-h-11 max-w-full rounded-lg border border-gray-300 px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {!available.includes(selected as DemoGradePersona) && (
            <option value={selected ?? ""} disabled>
              {selected === "owner" ? "기본 Owner" : "대표를 선택해 주세요"}
            </option>
          )}
          {available.map((persona) => (
            <option key={persona} value={persona}>
              {persona.slice(-1)}학년 대표 · {persona}
            </option>
          ))}
        </select>
        <Link prefetch={false} className="underline" href="/demo">
          대표 정보
        </Link>
      </label>
      {available.length === 0 && (
        <p className="mt-2 text-sm">대표 계정이 아직 준비되지 않았어요.</p>
      )}
      {pending && (
        <Spinner
          tone="brand"
          className="mt-2 size-4"
          label="대표를 변경하는 중"
        />
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm">
          {error}
        </p>
      )}
    </aside>
  );
}
