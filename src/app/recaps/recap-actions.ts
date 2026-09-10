"use server";

import { listRecapYears } from "./recap-years";

/** 연도 선택 드롭다운에 넣을, 리캡이 있는 연도를 조회합니다. */
export async function listRecapYearsAction(): Promise<number[]> {
  return listRecapYears();
}
