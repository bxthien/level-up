import { endOfLocalDay, isoDayKey, startOfLocalDay } from "@/shared/lib/day";

import { findTasksForDayRange } from "../infrastructure/task.repository";

export async function getTodayBoard() {
  const today = startOfLocalDay(new Date());
  const tasks = await findTasksForDayRange(today, endOfLocalDay(today));

  const doneCount = tasks.filter((task) => task.status === "DONE").length;
  const doingCount = tasks.filter((task) => task.status === "DOING").length;
  const todoCount = tasks.filter((task) => task.status === "TODO").length;
  const progressPct = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

  return {
    dayKey: isoDayKey(today),
    tasks,
    stats: {
      doneCount,
      doingCount,
      todoCount,
      progressPct,
    },
  };
}
