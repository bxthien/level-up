import { prisma } from "@/lib/db";
import { endOfLocalDay, isoDayKey, startOfLocalDay } from "@/lib/day";

import KanbanBoard from "./kanban-board";
import QuickCreateForm from "./quick-create-form";

export default async function TodayPage() {
  const today = startOfLocalDay(new Date());
  const dayKey = isoDayKey(today);

  const tasks = await prisma.task.findMany({
    where: {
      plannedFor: { gte: today, lte: endOfLocalDay(today) },
    },
    orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "asc" }],
  });

  const doneCount = tasks.filter((t) => t.status === "DONE").length;
  const doingCount = tasks.filter((t) => t.status === "DOING").length;
  const todoCount = tasks.filter((t) => t.status === "TODO").length;
  const progressPct = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hom nay</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {dayKey} · Hoan thanh {doneCount}/{tasks.length} · {progressPct}%
          </p>
        </div>
        <div className="w-28 sm:w-40">
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-teal-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <QuickCreateForm />

      <section className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-700/40 dark:bg-amber-900/20 p-2">
          <div className="text-xs text-amber-700 dark:text-amber-200">Can lam</div>
          <div className="text-lg font-semibold">{todoCount}</div>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 dark:border-indigo-700/40 dark:bg-indigo-900/20 p-2">
          <div className="text-xs text-indigo-700 dark:text-indigo-200">Dang lam</div>
          <div className="text-lg font-semibold">{doingCount}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-700/40 dark:bg-emerald-900/20 p-2">
          <div className="text-xs text-emerald-700 dark:text-emerald-200">Da xong</div>
          <div className="text-lg font-semibold">{doneCount}</div>
        </div>
      </section>

      {tasks.length === 0 ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Chua co task. Tao task dau tien bang nut + o goc duoi.
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

