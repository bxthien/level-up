import { getTodayBoard } from "@/features/today/application/get-today-board";
import KanbanBoard from "@/features/today/presentation/kanban-board";
import QuickCreateForm from "@/features/today/presentation/quick-create-form";

import {
  createTask,
  deleteTask,
  persistTaskOrder,
  updateTaskActual,
} from "./actions";

export default async function TodayPage() {
  const board = await getTodayBoard();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-violet-900 dark:text-violet-100">
            Today
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {board.dayKey} · Completed {board.stats.doneCount}/{board.tasks.length} ·{" "}
            {board.stats.progressPct}%
          </p>
        </div>
        <div className="w-28 sm:w-40">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              style={{ width: `${board.stats.progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <QuickCreateForm createTaskAction={createTask} />

      <section className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-2 dark:border-rose-700/40 dark:bg-rose-900/20">
          <div className="text-xs text-rose-700 dark:text-rose-200">To Do</div>
          <div className="text-lg font-semibold text-rose-900 dark:text-rose-100">
            {board.stats.todoCount}
          </div>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-2 dark:border-violet-700/40 dark:bg-violet-900/20">
          <div className="text-xs text-violet-700 dark:text-violet-200">Doing</div>
          <div className="text-lg font-semibold text-violet-900 dark:text-violet-100">
            {board.stats.doingCount}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 dark:border-emerald-700/40 dark:bg-emerald-900/20">
          <div className="text-xs text-emerald-700 dark:text-emerald-200">Done</div>
          <div className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
            {board.stats.doneCount}
          </div>
        </div>
      </section>

      {board.tasks.length === 0 ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          No tasks yet. Create your first task with the + button in the corner.
        </div>
      ) : (
        <KanbanBoard
          tasks={board.tasks}
          deleteTaskAction={deleteTask}
          persistTaskOrderAction={persistTaskOrder}
          updateTaskActualAction={updateTaskActual}
        />
      )}
    </div>
  );
}
