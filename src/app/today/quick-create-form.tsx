"use client";

import { useState } from "react";

import { createTask } from "./actions";

const categories = [
  { id: "WORK", label: "Cong viec" },
  { id: "SKILL", label: "Ky nang" },
  { id: "HEALTH", label: "Suc khoe" },
  { id: "PERSONAL", label: "Ca nhan" },
] as const;

const priorities = [5, 4, 3, 2, 1] as const;

export default function QuickCreateForm() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<(typeof categories)[number]["id"]>("WORK");
  const [priority, setPriority] = useState(3);
  const [showKpi, setShowKpi] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-30 h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition hover:scale-105 hover:bg-indigo-500 active:scale-95"
        aria-label="Them task"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-slate-900/55 p-3">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                Them task nhanh
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200"
              >
                Dong
              </button>
            </div>

            <form
              action={async (formData) => {
                await createTask(formData);
                setOpen(false);
              }}
              className="mt-3 flex flex-col gap-3"
            >
              <input
                name="title"
                required
                placeholder="Nhap task can lam hom nay..."
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-base outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800"
              />

              <input type="hidden" name="category" value={category} />
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => {
                  const active = category === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCategory(item.id)}
                      className={[
                        "rounded-full px-3 py-1.5 text-sm border transition",
                        active
                          ? "bg-teal-600 text-white border-transparent shadow"
                          : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
                      ].join(" ")}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <input type="hidden" name="priority" value={priority} />
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs text-slate-600 dark:text-slate-300">Uu tien</span>
                {priorities.map((p) => {
                  const active = p === priority;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={[
                        "min-w-10 rounded-full px-3 py-1.5 text-sm border transition",
                        active
                          ? "bg-amber-500 text-slate-900 border-transparent"
                          : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
                      ].join(" ")}
                    >
                      P{p}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowKpi((v) => !v)}
                  className="text-xs rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
                >
                  {showKpi ? "An KPI" : "Them KPI"}
                </button>
              </div>

              {showKpi ? (
                <div className="grid grid-cols-3 gap-2">
                  <input
                    name="kpiTarget"
                    inputMode="numeric"
                    placeholder="Muc tieu"
                    className="col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
                  />
                  <select
                    name="kpiUnit"
                    defaultValue=""
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="">Don vi</option>
                    <option value="MINUTES">Phut</option>
                    <option value="COUNT">Lan</option>
                  </select>
                </div>
              ) : null}

              <button className="rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500">
                Tao task
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

