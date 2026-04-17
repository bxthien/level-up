import { getHabitsPageData } from "@/features/habits/application/get-habits-page-data";
import HabitsPageScreen from "@/features/habits/presentation/habits-page";

import {
  adjustHabitCheck,
  createHabit,
  deleteHabit,
  toggleHabitActive,
} from "./actions";

export default async function HabitsPage() {
  const data = await getHabitsPageData();

  return (
    <HabitsPageScreen
      cards={data.cards}
      stats={data.stats}
      adjustHabitCheckAction={adjustHabitCheck}
      createHabitAction={createHabit}
      deleteHabitAction={deleteHabit}
      toggleHabitActiveAction={toggleHabitActive}
    />
  );
}
