import { prisma } from "@/lib/db";
import { endOfLocalDay, isoDayKey, startOfLocalDay } from "@/lib/day";

import KanbanBoard from "./kanban-board";
import QuickCreateForm from "./quick-create-form";

type TodayTask = {
  id: string;
  title: string;
  category: string;
  status: "TODO" | "DOING" | "DONE";
  priority: number;
  kpiTarget: number | null;
  kpiUnit: "MINUTES" | "COUNT" | null;
  kpiActual: number;
};

export default async function TodayPage() {
  const today = startOfLocalDay(new Date());
  const dayKey = isoDayKey(today);

  const tasks = (await prisma.task.findMany({
    where: {
      plannedFor: { gte: today, lte: endOfLocalDay(today) },
    },
    orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "asc" }],
  })) as TodayTask[];

  const doneCount = tasks.filter((t) => t.status === "DONE").length;
  const doingCount = tasks.filter((t) => t.status === "DOING").length;
  const todoCount = tasks.filter((t) => t.status === "TODO").length;
  const progressPct = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-violet-900 dark:text-violet-100">Today</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {dayKey} · Completed {doneCount}/{tasks.length} · {progressPct}%
          </p>
        </div>
        <div className="w-28 sm:w-40">
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <QuickCreateForm />

      <section className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-700/40 dark:bg-rose-900/20 p-2">
          <div className="text-xs text-rose-700 dark:text-rose-200">To Do</div>
          <div className="text-lg font-semibold text-rose-900 dark:text-rose-100">{todoCount}</div>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 dark:border-violet-700/40 dark:bg-violet-900/20 p-2">
          <div className="text-xs text-violet-700 dark:text-violet-200">Doing</div>
          <div className="text-lg font-semibold text-violet-900 dark:text-violet-100">{doingCount}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-700/40 dark:bg-emerald-900/20 p-2">
          <div className="text-xs text-emerald-700 dark:text-emerald-200">Done</div>
          <div className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">{doneCount}</div>
        </div>
      </section>

      {tasks.length === 0 ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          No tasks yet. Create your first task with the + button in the corner.
        </div>
      ) : (
        <KanbanBoard
          tasks={tasks.map((t) => ({
            id: t.id,
            title: t.title,
            category: t.category,
            status: t.status,
            priority: t.priority,
            kpiTarget: t.kpiTarget,
            kpiUnit: t.kpiUnit,
            kpiActual: t.kpiActual,
          }))}
        />
      )}
    </div>
  );
}
