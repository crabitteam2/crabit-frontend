import { WeeklyRecapEmpty } from "../_components/weekly-recap-empty";
import { WeeklyRecapStory } from "../_components/weekly-recap-story";
import { loadWeeklyRecapView } from "./load-weekly-recap";

export default async function WeeklyRecapPage() {
  const view = await loadWeeklyRecapView();

  if (view === null) return <WeeklyRecapEmpty closeHref="/" />;

  return <WeeklyRecapStory closeHref="/" feedHref="/feed" {...view} />;
}
