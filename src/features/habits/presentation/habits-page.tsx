type HabitCard = {
  id: string;
  title: string;
  frequency: "DAILY" | "WEEKLY";
  isActive: boolean;
  progress: number;
  streak: number;
  targetPerPeriod: number;
  scheduledToday: boolean;
  scheduleLabel: string;
};

type Props = {
  cards: HabitCard[];
  stats: {
    activeCount: number;
    completedCount: number;
    bestStreak: number;
  };
  adjustHabitCheckAction: (formData: FormData) => Promise<void>;
  createHabitAction: (formData: FormData) => Promise<void>;
  deleteHabitAction: (formData: FormData) => Promise<void>;
  toggleHabitActiveAction: (formData: FormData) => Promise<void>;
};

export default function HabitsPageScreen({
  cards,
  stats,
  adjustHabitCheckAction,
  createHabitAction,
  deleteHabitAction,
  toggleHabitActiveAction,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-100">
          Habits
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Build repeatable routines, check progress each day, and keep your streak alive.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/40 dark:bg-emerald-900/20">
          <div className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
            Active habits
          </div>
          <div className="mt-1 text-2xl font-semibold text-emerald-950 dark:text-emerald-100">
            {stats.activeCount}
          </div>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/40 dark:bg-blue-900/20">
          <div className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
            Completed this period
          </div>
          <div className="mt-1 text-2xl font-semibold text-blue-950 dark:text-blue-100">
            {stats.completedCount}/{stats.activeCount}
          </div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/40 dark:bg-amber-900/20">
          <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
            Best streak
          </div>
          <div className="mt-1 text-2xl font-semibold text-amber-950 dark:text-amber-100">
            {stats.bestStreak}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create habit</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track one habit daily or weekly, and optionally limit it to selected weekdays.
          </p>
        </div>

        <form action={createHabitAction} className="grid gap-3 md:grid-cols-2">
          <input
            name="title"
            required
            placeholder="Habit name"
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-800"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              name="frequency"
              defaultValue="DAILY"
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
            </select>
            <input
              name="targetPerPeriod"
              type="number"
              min="1"
              max="100"
              defaultValue="1"
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="md:col-span-2">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Scheduled weekdays
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 4, 8, 16, 32, 64].map((bit, index) => (
                <label
                  key={bit}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  <input type="checkbox" name="weekDays" value={bit} className="h-4 w-4" />
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <button className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500">
              Create habit
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4">
        {cards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No habits yet. Create your first repeatable routine above.
          </div>
        ) : (
          cards.map((habit) => (
            <article
              key={habit.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {habit.title}
                    </h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {habit.frequency === "DAILY" ? "Daily" : "Weekly"}
                    </span>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        habit.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                      ].join(" ")}
                    >
                      {habit.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Schedule: {habit.scheduleLabel}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/80">
                      Progress: {habit.progress}/{habit.targetPerPeriod}
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/80">
                      Streak: {habit.streak}
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/80">
                      {habit.scheduledToday ? "Scheduled today" : "Not scheduled today"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <form action={adjustHabitCheckAction}>
                      <input type="hidden" name="habitId" value={habit.id} />
                      <input type="hidden" name="delta" value="-1" />
                      <button
                        disabled={!habit.scheduledToday || !habit.isActive}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200"
                      >
                        -1
                      </button>
                    </form>
                    <form action={adjustHabitCheckAction}>
                      <input type="hidden" name="habitId" value={habit.id} />
                      <input type="hidden" name="delta" value="1" />
                      <button
                        disabled={!habit.scheduledToday || !habit.isActive}
                        className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-emerald-500"
                      >
                        Log today
                      </button>
                    </form>
                  </div>

                  <div className="flex items-center gap-2">
                    <form action={toggleHabitActiveAction}>
                      <input type="hidden" name="habitId" value={habit.id} />
                      <button className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200">
                        {habit.isActive ? "Pause" : "Resume"}
                      </button>
                    </form>
                    <form action={deleteHabitAction}>
                      <input type="hidden" name="habitId" value={habit.id} />
                      <button className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-600 dark:border-rose-700/40 dark:text-rose-300">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
