import { WeeklyRecapEmpty } from "../_components/weekly-recap-empty";
import { WeeklyRecapStory } from "../_components/weekly-recap-story";
import { loadWeeklyRecapView } from "./load-weekly-recap";

export default async function WeeklyRecapPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const view = await loadWeeklyRecapView(firstQueryValue(query.weekStart));

  if (view === null) return <WeeklyRecapEmpty closeHref="/" />;

  return <WeeklyRecapStory closeHref="/" feedHref="/feed" {...view} />;
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
