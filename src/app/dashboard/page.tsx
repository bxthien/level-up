export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-blue-300/70 bg-blue-50/60 dark:border-blue-500/40 dark:bg-blue-900/20 p-4">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-blue-800 dark:text-blue-200">
        Next phase: day, week, and month statistics, best and worst days, average score, and progress charts.
      </p>
    </div>
  );
}
