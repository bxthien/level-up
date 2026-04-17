import { addDays, endOfLocalWeek, isScheduledForDay, startOfLocalWeek } from "@/shared/lib/recurrence";
import { isoDayKey } from "@/shared/lib/day";

export type HabitFrequency = "DAILY" | "WEEKLY";

export type HabitRecord = {
  id: string;
  title: string;
  frequency: HabitFrequency;
  weekDays: number | null;
  targetPerPeriod: number;
  isActive: boolean;
};

export type HabitCheckRecord = {
  habitId: string;
  day: Date;
  value: number;
};

export function streakForDailyHabit(habit: HabitRecord, checks: HabitCheckRecord[], today: Date) {
  const checkByDay = new Map(checks.map((check) => [isoDayKey(check.day), check.value]));
  let streak = 0;

  for (let offset = 0; offset < 180; offset += 1) {
    const day = addDays(today, -offset);
    if (!isScheduledForDay(habit.weekDays, day)) continue;

    const value = checkByDay.get(isoDayKey(day)) ?? 0;
    if (value >= habit.targetPerPeriod) {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
}

export function streakForWeeklyHabit(habit: HabitRecord, checks: HabitCheckRecord[], today: Date) {
  let streak = 0;

  for (let offset = 0; offset < 52; offset += 1) {
    const weekStart = startOfLocalWeek(addDays(today, -(offset * 7)));
    const weekEnd = endOfLocalWeek(weekStart);

    const total = checks.reduce((sum, check) => {
      if (check.day >= weekStart && check.day <= weekEnd) {
        return sum + check.value;
      }
      return sum;
    }, 0);

    if (total >= habit.targetPerPeriod) {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
}
