"use server";

import { revalidatePath } from "next/cache";

import {
  parseSaveJournalEntryInput,
  saveJournalEntry as saveJournalEntryCommand,
} from "@/features/journal/application/commands";

export async function saveJournalEntry(formData: FormData) {
  const input = parseSaveJournalEntryInput({
    day: formData.get("day"),
    wentWell: String(formData.get("wentWell") ?? ""),
    wentWrong: String(formData.get("wentWrong") ?? ""),
    improvement: String(formData.get("improvement") ?? ""),
  });

  await saveJournalEntryCommand(input);
  revalidatePath("/journal");
}
