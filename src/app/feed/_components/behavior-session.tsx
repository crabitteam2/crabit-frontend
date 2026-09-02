"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { EventQueue, type CollectionContext } from "@/lib/behavior/collector";
import type { components } from "@/lib/http/generated/crabit-backend";

type Account = components["schemas"]["CardBalanceAccount"];
export interface Entry {
  key: string;
  eventId: string;
  occurredAt: string;
  queue: EventQueue;
  submitted: boolean;
}
interface Session {
  context: CollectionContext;
  entry: Entry;
  accounts: Account[];
  selectAcademy: (id: string) => void;
}
const SessionContext = createContext<Session | null>(null);
export function useBehaviorSession() {
  return useContext(SessionContext);
}
export async function behaviorRead<T>(
  context: CollectionContext,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `/api/backend/v1/academies/${context.academyId}/${path}`,
    {
      ...init,
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Crabit-Behavior-Context": context.contextId,
      },
    },
  );
  if (!response.ok) {
    if (response.status === 409) {
      const error = await response
        .clone()
        .json()
        .catch(() => null);
      if (error?.code === "BEHAVIOR_CONTEXT_MISMATCH")
        window.dispatchEvent(
          new CustomEvent("crabit-context-invalid", {
            detail: context.contextId,
          }),
        );
    }
    throw new Error(String(response.status));
  }
  return response.json();
}
export function BehaviorSession({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [context, setContext] = useState<CollectionContext | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [bootstrap, setBootstrap] = useState(0);
  const [entry, setEntry] = useState<Entry | null>(null);
  const serial = useRef(Promise.resolve());
  const generation = useRef(0);
  const active = useRef<Entry | null>(null);
  const arrival = useRef<{ key: string; occurredAt: string } | null>(null);
  const mounted = useRef(false);
  const selectAcademy = (academyId: string) => {
    const version = ++generation.current;
    active.current?.queue.dispose();
    active.current = null;
    setContext(null);
    setEntry(null);
    serial.current = serial.current
      .catch(() => {})
      .then(async () => {
        if (version !== generation.current || !mounted.current) return;
        const response = await fetch("/api/behavior/context", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ academyId }),
        });
        if (!response.ok) throw new Error("학원 정보를 확인할 수 없어요.");
        const value = await response.json();
        if (version === generation.current && mounted.current) {
          setContext(value);
          setError(null);
        }
      })
      .catch(() => {
        if (version === generation.current)
          setError("학원 정보를 확인할 수 없어요.");
      });
  };
  useEffect(() => {
    mounted.current = true;
    const invalidate = (event: Event) => {
      if (
        !(event instanceof CustomEvent) ||
        event.detail !== active.current?.queue.context.contextId
      )
        return;
      generation.current++;
      active.current?.queue.dispose();
      active.current = null;
      setContext(null);
      setEntry(null);
      setError(null);
      setBootstrap((value) => value + 1);
    };
    window.addEventListener("crabit-context-invalid", invalidate);
    let cancelled = false;
    fetch("/api/backend/v1/me/card-balance-accounts", {
      cache: "no-store",
      credentials: "same-origin",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const page = await response.json();
        if (cancelled) return;
        setAccounts(page.items);
        if (page.items.length) {
          const selected = new URL(window.location.href).searchParams.get(
            "academyId",
          );
          selectAcademy(
            page.items.find((item: Account) => item.academyId === selected)
              ?.academyId ?? page.items[0].academyId,
          );
        } else setError("이용 가능한 학원이 없어요.");
      })
      .catch(() => {
        if (!cancelled) setError("프로필을 선택한 뒤 다시 시도해 주세요.");
      });
    return () => {
      window.removeEventListener("crabit-context-invalid", invalidate);
      cancelled = true;
      mounted.current = false;
      queueMicrotask(() => {
        if (!mounted.current) {
          generation.current++;
          active.current?.queue.dispose();
        }
      });
    };
  }, [bootstrap]);
  useEffect(() => {
    if (!arrival.current || arrival.current.key !== pathname)
      arrival.current = { key: pathname, occurredAt: new Date().toISOString() };
    if (!context) return;
    const activate = () => {
      active.current?.queue.dispose();
      const next = {
        key: pathname,
        eventId: crypto.randomUUID(),
        occurredAt: arrival.current!.occurredAt,
        queue: new EventQueue(context, fetch, () =>
          window.dispatchEvent(
            new CustomEvent("crabit-context-invalid", {
              detail: context.contextId,
            }),
          ),
        ),
        submitted: false,
      };
      active.current = next;
      setEntry(next);
    };
    // StrictMode replay preserves a committed entry. A pathname change always replaces it.
    if (
      !active.current ||
      active.current.key !== pathname ||
      active.current.queue.context !== context
    )
      activate();
    const hide = () => {
      active.current?.queue.dispose();
      active.current = null;
      setEntry(null);
    };
    const show = (event: PageTransitionEvent) => {
      if (event.persisted) {
        arrival.current = {
          key: pathname,
          occurredAt: new Date().toISOString(),
        };
        activate();
      }
    };
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", show);
    return () => {
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", show);
    };
  }, [pathname, context]);
  if (error)
    return (
      <p role="alert" className="p-6">
        {error}
      </p>
    );
  if (!context || !entry || entry.key !== pathname)
    return (
      <p role="status" className="p-6">
        불러오는 중이에요.
      </p>
    );
  return (
    <SessionContext.Provider
      value={{ context, entry, accounts, selectAcademy }}
    >
      {children}
    </SessionContext.Provider>
  );
}
