import { isoDayKey, startOfLocalDay } from "@/shared/lib/day";
import {
  addDays,
  endOfLocalWeek,
  formatWeekDays,
  isScheduledForDay,
  startOfLocalWeek,
} from "@/shared/lib/recurrence";

import {
  HabitCheckRecord,
  HabitRecord,
  streakForDailyHabit,
  streakForWeeklyHabit,
} from "../domain/habit";
import { findHabitChecksInRange, findHabitsForOverview } from "../infrastructure/habit.repository";

export async function getHabitsPageData() {
  const today = startOfLocalDay(new Date());
  const weekStart = startOfLocalWeek(today);
  const weekEnd = endOfLocalWeek(today);

  const habits = (await findHabitsForOverview()) as HabitRecord[];
  const checks = (await findHabitChecksInRange(
    habits.map((habit) => habit.id),
    addDays(today, -365),
    weekEnd,
  )) as HabitCheckRecord[];

  const checksByHabit = new Map<string, HabitCheckRecord[]>();
  for (const check of checks) {
    const existing = checksByHabit.get(check.habitId) ?? [];
    existing.push(check);
    checksByHabit.set(check.habitId, existing);
  }

  const cards = habits.map((habit) => {
    const habitChecks = checksByHabit.get(habit.id) ?? [];
    const todayValue =
      habitChecks.find((check) => isoDayKey(check.day) === isoDayKey(today))?.value ?? 0;
    const weekValue = habitChecks.reduce((sum, check) => {
      if (check.day >= weekStart && check.day <= weekEnd) {
        return sum + check.value;
      }
      return sum;
    }, 0);

    const progress = habit.frequency === "DAILY" ? todayValue : weekValue;
    const completed = progress >= habit.targetPerPeriod;
    const scheduledToday = isScheduledForDay(habit.weekDays, today);
    const streak =
      habit.frequency === "DAILY"
        ? streakForDailyHabit(habit, habitChecks, today)
        : streakForWeeklyHabit(habit, habitChecks, today);

    return {
      ...habit,
      progress,
      completed,
      scheduledToday,
      streak,
      scheduleLabel: formatWeekDays(habit.weekDays),
    };
  });

  const activeHabits = cards.filter((habit) => habit.isActive);

  return {
    cards,
    stats: {
      activeCount: activeHabits.length,
      completedCount: activeHabits.filter((habit) => habit.completed).length,
      bestStreak: cards.reduce((best, habit) => Math.max(best, habit.streak), 0),
    },
  };
}
