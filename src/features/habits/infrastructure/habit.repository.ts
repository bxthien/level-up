import { prisma } from "@/shared/db/prisma";

export function findHabitsForOverview() {
  return prisma.habit.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "asc" }],
  });
}

export function findHabitChecksInRange(habitIds: string[], start: Date, end: Date) {
  return prisma.habitCheck.findMany({
    where: {
      habitId: { in: habitIds },
      day: { gte: start, lte: end },
    },
    orderBy: { day: "desc" },
    select: {
      habitId: true,
      day: true,
      value: true,
    },
  });
}

export function createHabit(data: {
  title: string;
  frequency: "DAILY" | "WEEKLY";
  targetPerPeriod: number;
  weekDays: number | null;
}) {
  return prisma.habit.create({ data });
}

export function findHabitCheckForDay(habitId: string, day: Date) {
  return prisma.habitCheck.findUnique({
    where: {
      habitId_day: { habitId, day },
    },
  });
}

export function deleteHabitCheckForDay(habitId: string, day: Date) {
  return prisma.habitCheck.delete({
    where: {
      habitId_day: { habitId, day },
    },
  });
}

export function updateHabitCheckForDay(habitId: string, day: Date, value: number) {
  return prisma.habitCheck.update({
    where: {
      habitId_day: { habitId, day },
    },
    data: { value },
  });
}

export function createHabitCheckForDay(habitId: string, day: Date, value: number) {
  return prisma.habitCheck.create({
    data: { habitId, day, value },
  });
}

export function findHabitIsActive(id: string) {
  return prisma.habit.findUnique({
    where: { id },
    select: { isActive: true },
  });
}

export function updateHabitActive(id: string, isActive: boolean) {
  return prisma.habit.update({
    where: { id },
    data: { isActive },
  });
}

export function deleteHabitById(id: string) {
  return prisma.habit.delete({ where: { id } });
}
