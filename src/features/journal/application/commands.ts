import { z } from "zod";

import { startOfLocalDay } from "@/shared/lib/day";

import { upsertJournalEntry } from "../infrastructure/journal.repository";

const saveJournalEntrySchema = z.object({
  day: z.string().min(1),
  wentWell: z.string().max(5000),
  wentWrong: z.string().max(5000),
  improvement: z.string().max(5000),
});

export function parseSaveJournalEntryInput(raw: Record<string, unknown>) {
  const parsed = saveJournalEntrySchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid journal input");
  return parsed.data;
}

export async function saveJournalEntry(input: {
  day: string;
  wentWell: string;
  wentWrong: string;
  improvement: string;
}) {
  const day = startOfLocalDay(new Date(input.day));
  return upsertJournalEntry(day, {
    wentWell: input.wentWell.trim(),
    wentWrong: input.wentWrong.trim(),
    improvement: input.improvement.trim(),
  });
}
