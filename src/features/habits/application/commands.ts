import { z } from "zod";

import { startOfLocalDay } from "@/shared/lib/day";
import { buildWeekDaysMask } from "@/shared/lib/recurrence";

import {
  createHabit as createHabitRecord,
  createHabitCheckForDay,
  deleteHabitById,
  deleteHabitCheckForDay,
  findHabitCheckForDay,
  findHabitIsActive,
  updateHabitActive,
  updateHabitCheckForDay,
} from "../infrastructure/habit.repository";

const createHabitSchema = z.object({
  title: z.string().trim().min(1).max(140),
  frequency: z.enum(["DAILY", "WEEKLY"]),
  targetPerPeriod: z.coerce.number().int().min(1).max(100),
});

export function parseCreateHabitInput(raw: Record<string, unknown>, weekDays: FormDataEntryValue[]) {
  const parsed = createHabitSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid habit input");

  return {
    ...parsed.data,
    weekDays: buildWeekDaysMask(weekDays),
  };
}

export async function createHabit(input: {
  title: string;
  frequency: "DAILY" | "WEEKLY";
  targetPerPeriod: number;
  weekDays: number | null;
}) {
  return createHabitRecord(input);
}

const adjustHabitCheckSchema = z.object({
  habitId: z.string().min(1),
  delta: z.coerce.number().int().min(-1).max(1),
});

export function parseAdjustHabitCheckInput(raw: Record<string, unknown>) {
  const parsed = adjustHabitCheckSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid habit check input");
  return parsed.data;
}

export async function adjustHabitCheck(habitId: string, delta: number) {
  if (delta === 0) return;

  const today = startOfLocalDay(new Date());
  const existing = await findHabitCheckForDay(habitId, today);
  const nextValue = (existing?.value ?? 0) + delta;

  if (nextValue <= 0) {
    if (existing) {
      await deleteHabitCheckForDay(habitId, today);
    }
    return;
  }

  if (existing) {
    await updateHabitCheckForDay(habitId, today, nextValue);
    return;
  }

  await createHabitCheckForDay(habitId, today, nextValue);
}

const habitIdSchema = z.object({
  habitId: z.string().min(1),
});

export function parseHabitIdInput(raw: Record<string, unknown>) {
  const parsed = habitIdSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid habit id");
  return parsed.data;
}

export async function toggleHabitActive(habitId: string) {
  const habit = await findHabitIsActive(habitId);
  if (!habit) throw new Error("Habit not found");
  return updateHabitActive(habitId, !habit.isActive);
}

export async function deleteHabit(habitId: string) {
  return deleteHabitById(habitId);
}
