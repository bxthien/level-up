import { addDays } from "@/shared/lib/recurrence";
import { startOfLocalDay } from "@/shared/lib/day";

import { completionScore } from "../domain/journal-entry";
import { findJournalEntriesInRange, findJournalEntryByDay } from "../infrastructure/journal.repository";

export async function getJournalPageData() {
  const today = startOfLocalDay(new Date());
  const recentStart = addDays(today, -6);

  const [todayEntry, recentEntries] = await Promise.all([
    findJournalEntryByDay(today),
    findJournalEntriesInRange(recentStart, today),
  ]);

  const completionAverage =
    recentEntries.length === 0
      ? 0
      : Math.round(
          (recentEntries.reduce((sum, entry) => sum + completionScore(entry), 0) /
            (recentEntries.length * 3)) *
            100,
        );

  return {
    today,
    todayEntry,
    recentEntries,
    stats: {
      todayScore: completionScore(
        todayEntry ?? { wentWell: "", wentWrong: "", improvement: "" },
      ),
      recentCount: recentEntries.length,
      completionAverage,
    },
  };
}
