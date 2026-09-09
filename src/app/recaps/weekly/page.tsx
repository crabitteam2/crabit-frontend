import { WEEKLY_RECAP_MOCK } from "@/lib/mock/weekly-recap";
import { WeeklyRecapStory } from "../_components/weekly-recap-story";

/**
 * 주간 리캡 화면입니다.
 *
 * 아직 API를 붙이지 않아 시연용 값으로 그립니다.
 */
export default function WeeklyRecapPage() {
  return (
    <WeeklyRecapStory closeHref="/" feedHref="/feed" {...WEEKLY_RECAP_MOCK} />
  );
}
