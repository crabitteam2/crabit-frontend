import "server-only";

import { headers } from "next/headers";
import { readBffEnvironment } from "@/config/env";
import { MY_NAME } from "@/lib/mock/home";
import { resolveRequestPersona } from "./cookies";

/** 현재 요청의 데모 대표 표시명입니다. 실제 닉네임 계약이 없으면 목업 이름을 씁니다. */
export async function readPersonaDisplayName(): Promise<string> {
  if (readBffEnvironment().backendProfile !== "demo") return MY_NAME;
  const persona = resolveRequestPersona(new Headers(await headers()), "demo");
  return persona?.startsWith("grade-")
    ? `${persona.slice(-1)}학년 대표`
    : MY_NAME;
}
