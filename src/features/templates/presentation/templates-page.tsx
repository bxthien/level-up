import { templateCategories } from "../application/get-templates-page-data";

type TemplateCard = {
  id: string;
  title: string;
  category: "WORK" | "SKILL" | "HEALTH" | "PERSONAL";
  priority: number;
  frequency: "DAILY" | "WEEKLY";
  isActive: boolean;
  kpiTarget: number | null;
  kpiUnit: "MINUTES" | "COUNT" | null;
  scheduleLabel: string;
  _count: {
    tasks: number;
  };
};

type Props = {
  templates: TemplateCard[];
  stats: {
    totalCount: number;
    activeCount: number;
    generatedCount: number;
  };
  createTaskFromTemplateNowAction: (formData: FormData) => Promise<void>;
  createTemplateAction: (formData: FormData) => Promise<void>;
  deleteTemplateAction: (formData: FormData) => Promise<void>;
  toggleTemplateActiveAction: (formData: FormData) => Promise<void>;
};

export default function TemplatesPageScreen({
  templates,
  stats,
  createTaskFromTemplateNowAction,
  createTemplateAction,
  deleteTemplateAction,
  toggleTemplateActiveAction,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-violet-950 dark:text-violet-100">
          Task Templates
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Define recurring tasks once, then let your daily workflow start with the right defaults.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-700/40 dark:bg-violet-900/20">
          <div className="text-xs uppercase tracking-wide text-violet-700 dark:text-violet-200">
            Total templates
          </div>
          <div className="mt-1 text-2xl font-semibold text-violet-950 dark:text-violet-100">
            {stats.totalCount}
          </div>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/40 dark:bg-blue-900/20">
          <div className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
            Active
          </div>
          <div className="mt-1 text-2xl font-semibold text-blue-950 dark:text-blue-100">
            {stats.activeCount}
          </div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/40 dark:bg-amber-900/20">
          <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
            Generated tasks
          </div>
          <div className="mt-1 text-2xl font-semibold text-amber-950 dark:text-amber-100">
            {stats.generatedCount}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create template</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Use daily templates for everyday work and weekly templates for specific weekdays.
          </p>
        </div>

        <form action={createTemplateAction} className="grid gap-3 md:grid-cols-2">
          <input
            name="title"
            required
            placeholder="Template title"
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 dark:border-slate-700 dark:bg-slate-800"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              name="category"
              defaultValue="WORK"
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              {templateCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              name="frequency"
              defaultValue="DAILY"
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3 md:col-span-2">
            <input
              name="priority"
              type="number"
              min="1"
              max="5"
              defaultValue="3"
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              name="kpiTarget"
              type="number"
              min="1"
              placeholder="KPI target"
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            />
            <select
              name="kpiUnit"
              defaultValue=""
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="">KPI unit</option>
              <option value="MINUTES">Minutes</option>
              <option value="COUNT">Count</option>
            </select>
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
            <button className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500">
              Create template
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4">
        {templates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No templates yet. Create one above, then generate tasks from it daily.
          </div>
        ) : (
          templates.map((template) => (
            <article
              key={template.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {template.title}
                    </h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {template.frequency === "DAILY" ? "Daily" : "Weekly"}
                    </span>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        template.isActive
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                      ].join(" ")}
                    >
                      {template.isActive ? "Active" : "Paused"}
                    </span>
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Category: {templateCategories.find((category) => category.id === template.category)?.label}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Schedule: {template.scheduleLabel}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/80">
                      Priority: P{template.priority}
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/80">
                      KPI:{" "}
                      {template.kpiTarget && template.kpiUnit
                        ? `${template.kpiTarget} ${template.kpiUnit.toLowerCase()}`
                        : "None"}
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/80">
                      Generated: {template._count.tasks}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <form action={createTaskFromTemplateNowAction}>
                    <input type="hidden" name="templateId" value={template.id} />
                    <button className="w-full rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500">
                      Create task today
                    </button>
                  </form>
                  <div className="flex items-center gap-2">
                    <form action={toggleTemplateActiveAction}>
                      <input type="hidden" name="templateId" value={template.id} />
                      <button className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200">
                        {template.isActive ? "Pause" : "Resume"}
                      </button>
                    </form>
                    <form action={deleteTemplateAction}>
                      <input type="hidden" name="templateId" value={template.id} />
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
