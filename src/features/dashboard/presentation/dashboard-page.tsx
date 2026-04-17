import { activityLabel, pct } from "../domain/dashboard";

type Props = {
  chartMaxMinutes: number;
  chartMaxTasks: number;
  createActivityLogAction: (formData: FormData) => Promise<void>;
  deleteActivityLogAction: (formData: FormData) => Promise<void>;
  heatmapWeeks: {
    date: Date;
    dayKey: string;
    label: string;
    totalMinutes: number;
    doneTasks: number;
    taskCount: number;
    journaled: boolean;
    score: number;
  }[][];
  last7Days: {
    date: Date;
    dayKey: string;
    label: string;
    totalTasks: number;
    doneTasks: number;
    totalMinutes: number;
    journaled: boolean;
  }[];
  stats: {
    todayDone: number;
    todayTaskCount: number;
    weekDone: number;
    weekTaskCount: number;
    taskCompletionToday: number;
    taskCompletionWeek: number;
    completedHabitsThisWeek: number;
    activeHabitCount: number;
    minutesThisWeek: number;
    countsThisWeek: number;
  };
  todayActivityLogs: {
    id: string;
    type: "STUDY" | "WORKOUT" | "DEEP_WORK" | "READING" | "OTHER";
    minutes: number | null;
    count: number | null;
    note: string;
  }[];
};

export default function DashboardPageScreen({
  chartMaxMinutes,
  chartMaxTasks,
  createActivityLogAction,
  deleteActivityLogAction,
  heatmapWeeks,
  last7Days,
  stats,
  todayActivityLogs,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-blue-950 dark:text-blue-100">
          Dashboard
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Track the week across tasks, habits, journal consistency, and activity logs.
        </p>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/40 dark:bg-blue-900/20">
          <div className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">Tasks today</div>
          <div className="mt-1 text-2xl font-semibold text-blue-950 dark:text-blue-100">
            {stats.todayDone}/{stats.todayTaskCount}
          </div>
          <div className="mt-1 text-xs text-blue-800 dark:text-blue-200">
            {stats.taskCompletionToday}% completed
          </div>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-700/40 dark:bg-violet-900/20">
          <div className="text-xs uppercase tracking-wide text-violet-700 dark:text-violet-200">Tasks this week</div>
          <div className="mt-1 text-2xl font-semibold text-violet-950 dark:text-violet-100">
            {stats.weekDone}/{stats.weekTaskCount}
          </div>
          <div className="mt-1 text-xs text-violet-800 dark:text-violet-200">
            {stats.taskCompletionWeek}% completed
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/40 dark:bg-emerald-900/20">
          <div className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">Habits this week</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-950 dark:text-emerald-100">
            {stats.completedHabitsThisWeek}/{stats.activeHabitCount}
          </div>
          <div className="mt-1 text-xs text-emerald-800 dark:text-emerald-200">on target</div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/40 dark:bg-amber-900/20">
          <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">Focus volume</div>
          <div className="mt-1 text-2xl font-semibold text-amber-950 dark:text-amber-100">
            {stats.minutesThisWeek}m
          </div>
          <div className="mt-1 text-xs text-amber-800 dark:text-amber-200">
            {stats.countsThisWeek} total count entries
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Last 7 days</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quick trend view for output, time investment, and journaling consistency.
            </p>
          </div>

          <div className="grid gap-3">
            {last7Days.map((day) => (
              <div
                key={day.dayKey}
                className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{day.dayKey}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {day.journaled ? "Journaled" : "No journal"}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/80">
                    Tasks: {day.doneTasks}/{day.totalTasks}
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/80">
                    Focus minutes: {day.totalMinutes}
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/80">
                    Completion: {pct(day.doneTasks, day.totalTasks)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Log activity</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track study, workout, reading, deep work, or any other measurable activity.
            </p>
          </div>

          <form action={createActivityLogAction} className="grid gap-3">
            <select
              name="type"
              defaultValue="STUDY"
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="STUDY">Study</option>
              <option value="WORKOUT">Workout</option>
              <option value="DEEP_WORK">Deep Work</option>
              <option value="READING">Reading</option>
              <option value="OTHER">Other</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="minutes"
                type="number"
                min="0"
                placeholder="Minutes"
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
              />
              <input
                name="count"
                type="number"
                min="0"
                placeholder="Count"
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <textarea
              name="note"
              rows={3}
              placeholder="Short note"
              className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            />

            <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500">
              Add activity log
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">7-day activity chart</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Blue bars show focus minutes. Violet bars show planned task volume.
            </p>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {last7Days.map((day) => {
              const minutesHeight = Math.max(10, Math.round((day.totalMinutes / chartMaxMinutes) * 140));
              const tasksHeight = Math.max(10, Math.round((day.totalTasks / chartMaxTasks) * 140));

              return (
                <div key={day.dayKey} className="flex flex-col items-center gap-2">
                  <div className="flex h-40 items-end gap-1.5">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{day.totalMinutes}m</div>
                      <div
                        className="w-5 rounded-t-md bg-blue-500"
                        style={{ height: `${minutesHeight}px` }}
                        title={`${day.dayKey}: ${day.totalMinutes} minutes`}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{day.totalTasks}</div>
                      <div
                        className="w-5 rounded-t-md bg-violet-500"
                        style={{ height: `${tasksHeight}px` }}
                        title={`${day.dayKey}: ${day.totalTasks} tasks`}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-200">{day.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {day.doneTasks}/{day.totalTasks}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-blue-500" />
              Focus minutes
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-violet-500" />
              Planned tasks
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">4-week focus heatmap</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Darker cells mean more focus minutes. Border color shows whether that day had a journal entry.
            </p>
          </div>

          <div className="grid gap-3">
            {heatmapWeeks.map((week, index) => (
              <div key={index} className="grid grid-cols-7 gap-2">
                {week.map((day) => {
                  const intensityClass =
                    day.score === 4
                      ? "bg-emerald-600 text-white"
                      : day.score === 3
                        ? "bg-emerald-500 text-white"
                        : day.score === 2
                          ? "bg-emerald-300 text-emerald-950"
                          : day.score === 1
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";

                  return (
                    <div
                      key={day.dayKey}
                      className={[
                        "rounded-xl border p-2 text-center",
                        intensityClass,
                        day.journaled ? "border-amber-400 dark:border-amber-300" : "border-transparent",
                      ].join(" ")}
                      title={`${day.dayKey} · ${day.totalMinutes}m · ${day.doneTasks}/${day.taskCount} tasks`}
                    >
                      <div className="text-[10px] uppercase tracking-wide">{day.label}</div>
                      <div className="mt-1 text-sm font-semibold">{day.totalMinutes}m</div>
                      <div className="mt-1 text-[10px]">
                        {day.doneTasks}/{day.taskCount} tasks
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">0m</span>
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-900">1-29m</span>
            <span className="rounded-full bg-emerald-300 px-2 py-1 text-emerald-950">30-59m</span>
            <span className="rounded-full bg-emerald-500 px-2 py-1 text-white">60-119m</span>
            <span className="rounded-full bg-emerald-600 px-2 py-1 text-white">120m+</span>
            <span className="rounded-full border border-amber-400 px-2 py-1">Journaled</span>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Today&apos;s activity logs</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Recent entries for today. Delete anything that was logged by mistake.
          </p>
        </div>

        <div className="grid gap-3">
          {todayActivityLogs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No activity logs yet today.
            </div>
          ) : (
            todayActivityLogs.map((log) => (
              <article
                key={log.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {activityLabel(log.type)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {log.minutes != null ? `${log.minutes} minutes` : "No minutes"} ·{" "}
                    {log.count != null ? `${log.count} count` : "No count"}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {log.note || "No note"}
                  </div>
                </div>

                <form action={deleteActivityLogAction}>
                  <input type="hidden" name="id" value={log.id} />
                  <button className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-600 dark:border-rose-700/40 dark:text-rose-300">
                    Delete
                  </button>
                </form>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
