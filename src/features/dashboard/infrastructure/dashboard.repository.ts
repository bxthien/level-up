import { prisma } from "@/shared/db/prisma";

export function findTasksInRange(start: Date, end: Date) {
  return prisma.task.findMany({
    where: { plannedFor: { gte: start, lte: end } },
  });
}

export function findActiveHabits() {
  return prisma.habit.findMany({ where: { isActive: true } });
}

export function findHabitChecksInRange(start: Date, end: Date) {
  return prisma.habitCheck.findMany({
    where: { day: { gte: start, lte: end } },
  });
}

export function findJournalEntriesInRange(start: Date, end: Date) {
  return prisma.journalEntry.findMany({
    where: { day: { gte: start, lte: end } },
  });
}

export function findActivityLogsInRange(start: Date, end: Date) {
  return prisma.activityLog.findMany({
    where: { day: { gte: start, lte: end } },
    orderBy: [{ day: "desc" }, { createdAt: "desc" }],
  });
}

export function createActivityLog(data: {
  day: Date;
  type: "STUDY" | "WORKOUT" | "DEEP_WORK" | "READING" | "OTHER";
  minutes?: number;
  count?: number;
  note: string;
}) {
  return prisma.activityLog.create({ data });
}

export function deleteActivityLogById(id: string) {
  return prisma.activityLog.delete({ where: { id } });
}
