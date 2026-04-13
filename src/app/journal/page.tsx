export default function JournalPage() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-yellow-300/70 bg-yellow-50/60 dark:border-yellow-500/40 dark:bg-yellow-900/20 p-4">
      <h1 className="text-2xl font-semibold tracking-tight">Daily journal</h1>
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        Next phase: timeline entries (what went well / wrong / improvement).
      </p>
    </div>
  );
}

