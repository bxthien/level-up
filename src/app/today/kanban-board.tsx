"use client";

import { useMemo, useState, useTransition } from "react";

import { deleteTask, updateTaskActual, updateTaskStatus } from "./actions";

type TaskStatus = "TODO" | "DOING" | "DONE";

type TaskItem = {
  id: string;
  title: string;
  category: string;
  status: TaskStatus;
  priority: number;
  kpiTarget: number | null;
  kpiUnit: string | null;
  kpiActual: number;
};

type Props = {
  tasks: TaskItem[];
};

const columns: { id: TaskStatus; label: string }[] = [
  { id: "TODO", label: "Can lam" },
  { id: "DOING", label: "Dang lam" },
  { id: "DONE", label: "Da xong" },
];

function categoryLabel(category: string) {
  if (category === "WORK") return "Cong viec";
  if (category === "SKILL") return "Ky nang";
  if (category === "HEALTH") return "Suc khoe";
  return "Ca nhan";
}

function formatKpi(unit: string | null | undefined, value: number) {
  if (unit === "MINUTES") return `${value}m`;
  if (unit === "COUNT") return `${value}`;
  return `${value}`;
}

export default function KanbanBoard({ tasks }: Props) {
  const [items, setItems] = useState<TaskItem[]>(tasks);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const grouped = useMemo(
    () => ({
      TODO: items.filter((t) => t.status === "TODO"),
      DOING: items.filter((t) => t.status === "DOING"),
      DONE: items.filter((t) => t.status === "DONE"),
    }),
    [items],
  );

  const onDropToColumn = (status: TaskStatus) => {
    if (!draggingId) return;
    const moving = items.find((t) => t.id === draggingId);
    if (!moving || moving.status === status) return;

    setItems((prev) =>
      prev.map((t) => (t.id === draggingId ? { ...t, status } : t)),
    );

    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", draggingId);
      formData.set("status", status);
      await updateTaskStatus(formData);
    });
  };

  const moveTask = (id: string, status: TaskStatus) => {
    const moving = items.find((t) => t.id === id);
    if (!moving || moving.status === status) return;

    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", id);
      formData.set("status", status);
      await updateTaskStatus(formData);
    });
  };

  return (
    <section className="overflow-x-auto pb-24">
      <div className="flex gap-3 min-w-[920px]">
        {columns.map((col) => (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDropToColumn(col.id)}
            className="w-[300px] shrink-0 rounded-2xl border border-slate-200 bg-white/90 p-3 dark:border-slate-700 dark:bg-slate-900/90"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {col.label}
              </h3>
              <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {grouped[col.id].length}
              </span>
            </div>

            <div className="flex flex-col gap-2 min-h-24">
              {grouped[col.id].map((t) => {
                const hasKpi = t.kpiTarget != null && t.kpiUnit != null;
                const pct =
                  hasKpi && t.kpiTarget! > 0
                    ? Math.min(100, Math.round((t.kpiActual / t.kpiTarget!) * 100))
                    : null;

                return (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={() => setDraggingId(t.id)}
                    onDragEnd={() => setDraggingId(null)}
                    className={[
                      "rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900",
                      draggingId === t.id ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    <div className="font-medium text-sm">{t.title}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] rounded-full border border-indigo-200 px-2 py-0.5 text-indigo-700 dark:border-indigo-600/40 dark:text-indigo-200">
                        {categoryLabel(t.category)}
                      </span>
                      <span className="text-[11px] text-amber-700 dark:text-amber-200">
                        P{t.priority}
                      </span>
                    </div>

                    {hasKpi ? (
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                        KPI: {formatKpi(t.kpiUnit, t.kpiActual)} /{" "}
                        {formatKpi(t.kpiUnit, t.kpiTarget!)} ({pct}%)
                      </div>
                    ) : null}

                    {hasKpi ? (
                      <form action={updateTaskActual} className="mt-2 flex items-center gap-2">
                        <input type="hidden" name="id" value={t.id} />
                        <input
                          name="kpiActual"
                          inputMode="numeric"
                          defaultValue={t.kpiActual}
                          className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none dark:border-slate-600 dark:bg-slate-800"
                        />
                        <button className="rounded-lg border border-indigo-300 px-2 py-1 text-xs text-indigo-700 dark:border-indigo-600/40 dark:text-indigo-200">
                          Luu
                        </button>
                      </form>
                    ) : null}

                    <form action={deleteTask} className="mt-2">
                      <input type="hidden" name="id" value={t.id} />
                      <button className="text-xs text-rose-600 dark:text-rose-300">
                        Xoa
                      </button>
                    </form>

                    {/* Mobile fallback: one-tap move without drag & drop */}
                    <div className="mt-2 flex flex-wrap gap-1 sm:hidden">
                      {(["TODO", "DOING", "DONE"] as const).map((next) => {
                        if (next === t.status) return null;
                        const label =
                          next === "TODO"
                            ? "Can lam"
                            : next === "DOING"
                              ? "Dang lam"
                              : "Da xong";
                        return (
                          <button
                            key={next}
                            type="button"
                            onClick={() => moveTask(t.id, next)}
                            className="rounded-md border border-slate-300 px-2 py-1 text-[11px] text-slate-600 dark:border-slate-600 dark:text-slate-300"
                          >
                            Chuyen sang {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {grouped[col.id].length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-600 dark:text-slate-500">
                  Keo task vao day
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {pending ? (
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Dang cap nhat trang thai...
        </div>
      ) : null}
    </section>
  );
}

