import { getJournalPageData } from "@/features/journal/application/get-journal-page-data";
import JournalPageScreen from "@/features/journal/presentation/journal-page";

import { saveJournalEntry } from "./actions";

export default async function JournalPage() {
  const data = await getJournalPageData();

  return (
    <JournalPageScreen
      recentEntries={data.recentEntries}
      stats={data.stats}
      today={data.today}
      todayEntry={data.todayEntry}
      saveJournalEntryAction={saveJournalEntry}
    />
  );
}
