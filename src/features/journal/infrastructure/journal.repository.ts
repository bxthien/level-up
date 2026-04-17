import { prisma } from "@/shared/db/prisma";

export function findJournalEntryByDay(day: Date) {
  return prisma.journalEntry.findUnique({ where: { day } });
}

export function findJournalEntriesInRange(start: Date, end: Date) {
  return prisma.journalEntry.findMany({
    where: { day: { gte: start, lte: end } },
    orderBy: { day: "desc" },
  });
}

export function upsertJournalEntry(day: Date, data: {
  wentWell: string;
  wentWrong: string;
  improvement: string;
}) {
  return prisma.journalEntry.upsert({
    where: { day },
    update: data,
    create: { day, ...data },
  });
}
