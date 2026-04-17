import { endOfLocalDay, isoDayKey, startOfLocalDay } from "@/shared/lib/day";
import { addDays, endOfLocalWeek, startOfLocalWeek } from "@/shared/lib/recurrence";

import { dayLabel, pct } from "../domain/dashboard";
import {
  findActiveHabits,
  findActivityLogsInRange,
  findHabitChecksInRange,
  findJournalEntriesInRange,
  findTasksInRange,
} from "../infrastructure/dashboard.repository";

export async function getDashboardPageData() {
  const today = startOfLocalDay(new Date());
  const weekStart = startOfLocalWeek(today);
  const weekEnd = endOfLocalWeek(today);
  const last7Start = addDays(today, -6);
  const heatmapStart = addDays(today, -27);

  const [
    todayTasks,
    weekTasks,
    recentTasks,
    activeHabits,
    weekChecks,
    recentEntries,
    todayActivityLogs,
    recentActivityLogs,
  ] = await Promise.all([
    findTasksInRange(today, endOfLocalDay(today)),
    findTasksInRange(weekStart, weekEnd),
    findTasksInRange(heatmapStart, endOfLocalDay(today)),
    findActiveHabits(),
    findHabitChecksInRange(weekStart, weekEnd),
    findJournalEntriesInRange(heatmapStart, today),
    findActivityLogsInRange(today, endOfLocalDay(today)),
    findActivityLogsInRange(last7Start, endOfLocalDay(today)),
  ]);

  const todayDone = todayTasks.filter((task) => task.status === "DONE").length;
  const weekDone = weekTasks.filter((task) => task.status === "DONE").length;

  const habitProgressThisWeek = new Map<string, number>();
  for (const check of weekChecks) {
    habitProgressThisWeek.set(
      check.habitId,
      (habitProgressThisWeek.get(check.habitId) ?? 0) + check.value,
    );
  }

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const day = addDays(last7Start, index);
    const dayLogs = recentActivityLogs.filter((log) => isoDayKey(log.day) === isoDayKey(day));
    const dayTasks = recentTasks.filter((task) => isoDayKey(task.plannedFor) === isoDayKey(day));
    const doneTasks = dayTasks.filter((task) => task.status === "DONE").length;

    return {
      date: day,
      dayKey: isoDayKey(day),
      label: dayLabel(day),
      totalTasks: dayTasks.length,
      doneTasks,
      totalMinutes: dayLogs.reduce((sum, log) => sum + (log.minutes ?? 0), 0),
      journaled: recentEntries.some((entry) => isoDayKey(entry.day) === isoDayKey(day)),
    };
  });

  const heatmapDays = Array.from({ length: 28 }, (_, index) => {
    const day = addDays(heatmapStart, index);
    const dayLogs = recentActivityLogs.filter((log) => isoDayKey(log.day) === isoDayKey(day));
    const dayTasks = recentTasks.filter((task) => isoDayKey(task.plannedFor) === isoDayKey(day));
    const doneTasks = dayTasks.filter((task) => task.status === "DONE").length;
    const totalMinutes = dayLogs.reduce((sum, log) => sum + (log.minutes ?? 0), 0);
    const score =
      totalMinutes >= 120 ? 4 : totalMinutes >= 60 ? 3 : totalMinutes >= 30 ? 2 : totalMinutes > 0 ? 1 : 0;

    return {
      date: day,
      dayKey: isoDayKey(day),
      label: dayLabel(day),
      totalMinutes,
      doneTasks,
      taskCount: dayTasks.length,
      journaled: recentEntries.some((entry) => isoDayKey(entry.day) === isoDayKey(day)),
      score,
    };
  });

  return {
    todayActivityLogs,
    last7Days,
    heatmapWeeks: Array.from({ length: 4 }, (_, weekIndex) =>
      heatmapDays.slice(weekIndex * 7, weekIndex * 7 + 7),
    ),
    chartMaxMinutes: Math.max(...last7Days.map((day) => day.totalMinutes), 1),
    chartMaxTasks: Math.max(...last7Days.map((day) => day.totalTasks), 1),
    stats: {
      todayDone,
      todayTaskCount: todayTasks.length,
      weekDone,
      weekTaskCount: weekTasks.length,
      taskCompletionToday: pct(todayDone, todayTasks.length),
      taskCompletionWeek: pct(weekDone, weekTasks.length),
      completedHabitsThisWeek: activeHabits.filter((habit) => {
        const progress = habitProgressThisWeek.get(habit.id) ?? 0;
        return progress >= habit.targetPerPeriod;
      }).length,
      activeHabitCount: activeHabits.length,
      minutesThisWeek: recentActivityLogs.reduce((sum, log) => sum + (log.minutes ?? 0), 0),
      countsThisWeek: recentActivityLogs.reduce((sum, log) => sum + (log.count ?? 0), 0),
    },
  };
}
