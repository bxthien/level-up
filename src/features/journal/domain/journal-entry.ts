export type JournalEntryView = {
  id: string;
  day: Date;
  wentWell: string;
  wentWrong: string;
  improvement: string;
};

export function completionScore(entry: {
  wentWell: string;
  wentWrong: string;
  improvement: string;
}) {
  return [entry.wentWell, entry.wentWrong, entry.improvement].filter(
    (value) => value.trim().length > 0,
  ).length;
}
