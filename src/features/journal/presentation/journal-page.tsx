import { isoDayKey } from "@/shared/lib/day";

import { completionScore } from "../domain/journal-entry";

type Props = {
  recentEntries: {
    id: string;
    day: Date;
    wentWell: string;
    wentWrong: string;
    improvement: string;
  }[];
  stats: {
    todayScore: number;
    recentCount: number;
    completionAverage: number;
  };
  today: Date;
  todayEntry: {
    wentWell: string;
    wentWrong: string;
    improvement: string;
  } | null;
  saveJournalEntryAction: (formData: FormData) => Promise<void>;
};

export default function JournalPageScreen({
  recentEntries,
  stats,
  today,
  todayEntry,
  saveJournalEntryAction,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-amber-950 dark:text-amber-100">
          Daily Journal
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Capture what went well, what went wrong, and what to improve while the day is still fresh.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/40 dark:bg-amber-900/20">
          <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
            Today
          </div>
          <div className="mt-1 text-2xl font-semibold text-amber-950 dark:text-amber-100">
            {stats.todayScore}/3
          </div>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/40 dark:bg-blue-900/20">
          <div className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
            Entries this week
          </div>
          <div className="mt-1 text-2xl font-semibold text-blue-950 dark:text-blue-100">
            {stats.recentCount}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/40 dark:bg-emerald-900/20">
          <div className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
            Completion quality
          </div>
          <div className="mt-1 text-2xl font-semibold text-emerald-950 dark:text-emerald-100">
            {stats.completionAverage}%
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Write today&apos;s entry
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You can update the same day as many times as you want. The latest version is saved.
          </p>
        </div>

        <form action={saveJournalEntryAction} className="grid gap-4">
          <input type="hidden" name="day" value={today.toISOString()} />

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">What went well</span>
            <textarea
              name="wentWell"
              defaultValue={todayEntry?.wentWell ?? ""}
              rows={5}
              placeholder="Wins, momentum, good decisions, small improvements..."
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-slate-700 dark:bg-slate-800"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">What went wrong</span>
            <textarea
              name="wentWrong"
              defaultValue={todayEntry?.wentWrong ?? ""}
              rows={5}
              placeholder="Distractions, mistakes, delays, missed commitments..."
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-slate-700 dark:bg-slate-800"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              What to improve tomorrow
            </span>
            <textarea
              name="improvement"
              defaultValue={todayEntry?.improvement ?? ""}
              rows={5}
              placeholder="One concrete adjustment for tomorrow..."
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-slate-700 dark:bg-slate-800"
            />
          </label>

          <div>
            <button className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400">
              Save journal entry
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Last 7 days</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Quick review of recent entries so patterns are easier to spot.
          </p>
        </div>

        <div className="grid gap-4">
          {recentEntries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No journal entries yet. Your reflections will appear here once you save them.
            </div>
          ) : (
            recentEntries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {isoDayKey(entry.day)}
                  </div>
                  <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {completionScore(entry)}/3 sections filled
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-sm dark:bg-emerald-900/20">
                    <div className="mb-1 font-medium text-emerald-700 dark:text-emerald-200">Went well</div>
                    <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                      {entry.wentWell || "No notes"}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-rose-50 p-3 text-sm dark:bg-rose-900/20">
                    <div className="mb-1 font-medium text-rose-700 dark:text-rose-200">Went wrong</div>
                    <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                      {entry.wentWrong || "No notes"}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
                    <div className="mb-1 font-medium text-amber-700 dark:text-amber-200">Improve next</div>
                    <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                      {entry.improvement || "No notes"}
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
