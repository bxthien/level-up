"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

const columns: { id: TaskStatus; label: string; accent: string; bgLight: string; bgDark: string; borderLight: string; borderDark: string }[] = [
  {
    id: "TODO",
    label: "To Do",
    accent: "text-rose-600 dark:text-rose-400",
    bgLight: "bg-rose-50/80",
    bgDark: "dark:bg-rose-950/30",
    borderLight: "border-rose-200",
    borderDark: "dark:border-rose-800/50",
  },
  {
    id: "DOING",
    label: "Doing",
    accent: "text-violet-600 dark:text-violet-400",
    bgLight: "bg-violet-50/80",
    bgDark: "dark:bg-violet-950/30",
    borderLight: "border-violet-200",
    borderDark: "dark:border-violet-800/50",
  },
  {
    id: "DONE",
    label: "Done",
    accent: "text-emerald-600 dark:text-emerald-400",
    bgLight: "bg-emerald-50/80",
    bgDark: "dark:bg-emerald-950/30",
    borderLight: "border-emerald-200",
    borderDark: "dark:border-emerald-800/50",
  },
];

const categoryColors: Record<string, { badge: string; darkBadge: string; text: string; darkText: string }> = {
  WORK: {
    badge: "border-blue-200 bg-blue-50",
    darkBadge: "dark:border-blue-700/40 dark:bg-blue-900/30",
    text: "text-blue-700",
    darkText: "dark:text-blue-200",
  },
  SKILL: {
    badge: "border-purple-200 bg-purple-50",
    darkBadge: "dark:border-purple-700/40 dark:bg-purple-900/30",
    text: "text-purple-700",
    darkText: "dark:text-purple-200",
  },
  HEALTH: {
    badge: "border-emerald-200 bg-emerald-50",
    darkBadge: "dark:border-emerald-700/40 dark:bg-emerald-900/30",
    text: "text-emerald-700",
    darkText: "dark:text-emerald-200",
  },
  PERSONAL: {
    badge: "border-amber-200 bg-amber-50",
    darkBadge: "dark:border-amber-700/40 dark:bg-amber-900/30",
    text: "text-amber-700",
    darkText: "dark:text-amber-200",
  },
};

function categoryLabel(category: string) {
  if (category === "WORK") return "Work";
  if (category === "SKILL") return "Skill";
  if (category === "HEALTH") return "Health";
  return "Personal";
}

function formatKpi(unit: string | null | undefined, value: number) {
  if (unit === "MINUTES") return `${value}m`;
  if (unit === "COUNT") return `${value}`;
  return `${value}`;
}

function TaskCard({
  task,
  isDragging,
  onMove,
  dragHandle,
}: {
  task: TaskItem;
  isDragging?: boolean;
  onMove?: (id: string, status: TaskStatus) => void;
  dragHandle?: React.ReactNode;
}) {
  const hasKpi = task.kpiTarget != null && task.kpiUnit != null;
  const pct =
    hasKpi && task.kpiTarget! > 0
      ? Math.min(100, Math.round((task.kpiActual / task.kpiTarget!) * 100))
      : null;

  const catColor = categoryColors[task.category] || categoryColors.PERSONAL;

  return (
    <div
      className={[
        "rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow dark:border-slate-700/80 dark:bg-slate-800/90",
        isDragging ? "opacity-50 shadow-lg ring-2 ring-violet-400/50" : "hover:shadow-md",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        {dragHandle && <div className="mt-0.5 shrink-0">{dragHandle}</div>}
        <div className="flex-1">
          <div className="font-medium text-sm text-slate-800 dark:text-slate-100">{task.title}</div>
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={[
                "text-[11px] rounded-full border px-2 py-0.5",
                catColor.badge,
                catColor.darkBadge,
                catColor.text,
                catColor.darkText,
              ].join(" ")}
            >
              {categoryLabel(task.category)}
            </span>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-300">
              P{task.priority}
            </span>
          </div>
        </div>
      </div>

      {hasKpi ? (
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>
              KPI: {formatKpi(task.kpiUnit, task.kpiActual)} /{" "}
              {formatKpi(task.kpiUnit, task.kpiTarget!)}
            </span>
            {pct != null && (
              <span className="font-medium text-violet-600 dark:text-violet-400">{pct}%</span>
            )}
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
              style={{ width: `${pct ?? 0}%` }}
            />
          </div>
        </div>
      ) : null}

      {hasKpi ? (
        <form action={updateTaskActual} className="mt-2.5 flex items-center gap-2">
          <input type="hidden" name="id" value={task.id} />
          <input
            name="kpiActual"
            inputMode="numeric"
            defaultValue={task.kpiActual}
            className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-violet-400 dark:border-slate-600 dark:bg-slate-700"
          />
          <button className="rounded-lg border border-violet-300 px-2.5 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-50 dark:border-violet-600/40 dark:text-violet-200 dark:hover:bg-violet-900/30">
            Save
          </button>
        </form>
      ) : null}

      <form action={deleteTask} className="mt-2">
        <input type="hidden" name="id" value={task.id} />
        <button className="text-xs text-slate-500 transition hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400">
          Delete
        </button>
      </form>

      {/* Mobile fallback: one-tap move without drag and drop */}
      <div className="mt-2 flex flex-wrap gap-1 sm:hidden">
        {(["TODO", "DOING", "DONE"] as const).map((next) => {
          if (next === task.status) return null;
          const label =
            next === "TODO"
              ? "To Do"
              : next === "DOING"
                ? "Doing"
                : "Done";
          return (
            <button
              key={next}
              type="button"
              onClick={() => onMove?.(task.id, next)}
              className="rounded-md border border-slate-300 px-2 py-1 text-[11px] text-slate-600 dark:border-slate-600 dark:text-slate-300"
            >
              Move to {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SortableTaskCard({ task, onMove }: { task: TaskItem; onMove: (id: string, status: TaskStatus) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="touch-none"
    >
      <TaskCard task={task} isDragging={isDragging} onMove={onMove} dragHandle={
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex h-8 w-8 touch-none cursor-grab items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing dark:hover:bg-slate-700 dark:hover:text-slate-200"
          aria-label="Keo de di chuyen"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </button>
      } />
    </div>
  );
}

function KanbanColumn({
  column,
  tasks,
  onMove,
}: {
  column: (typeof columns)[number];
  tasks: TaskItem[];
  onMove: (id: string, status: TaskStatus) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      status: column.id,
    },
  });

  const columnTaskIds = tasks.map((t) => t.id);

  return (
    <SortableContext items={columnTaskIds} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        data-column-id={column.id}
        className={[
          "rounded-2xl border p-3 transition-colors md:min-h-[28rem]",
          column.bgLight,
          column.bgDark,
          column.borderLight,
          column.borderDark,
          isOver ? "ring-2 ring-violet-400/50" : "",
        ].join(" ")}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className={["text-sm font-semibold", column.accent].join(" ")}>
            {column.label}
          </h3>
          <span
            className={[
              "text-xs rounded-full px-2 py-0.5 font-medium",
              column.bgLight,
              column.bgDark,
              column.accent,
            ].join(" ")}
          >
            {tasks.length}
          </span>
        </div>

        <div className="flex min-h-24 flex-col gap-2.5">
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onMove={onMove} />
          ))}

          {tasks.length === 0 ? (
            <div
              className={[
                "rounded-xl border-2 border-dashed p-6 text-center text-xs opacity-70 transition-colors",
                column.borderLight,
                column.borderDark,
                isOver ? "bg-white/70 dark:bg-slate-800/40 opacity-100" : "",
              ].join(" ")}
            >
              Drop task here
            </div>
          ) : null}
        </div>
      </div>
    </SortableContext>
  );
}

export default function KanbanBoard({ tasks }: Props) {
  const [items, setItems] = useState<TaskItem[]>(tasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  const dropAnimation = useMemo(
    () => ({
      sideEffects: defaultDropAnimationSideEffects({
        styles: {
          active: {
            opacity: "0.5",
          },
        },
      }),
    }),
    [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 8,
      },
    }),
  );

  const grouped = useMemo(
    () => ({
      TODO: items.filter((t) => t.status === "TODO"),
      DOING: items.filter((t) => t.status === "DOING"),
      DONE: items.filter((t) => t.status === "DONE"),
    }),
    [items],
  );

  const activeTask = useMemo(
    () => items.find((t) => t.id === activeId) ?? null,
    [items, activeId],
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragCancel = () => {
    setActiveId(null);
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTaskItem = items.find((t) => t.id === active.id);
    if (!activeTaskItem) return;

    const overTask = items.find((t) => t.id === over.id);
    const overType = over.data.current?.type;

    if (overTask && overTask.status === activeTaskItem.status) {
      const columnTasks = items.filter((t) => t.status === activeTaskItem.status);
      const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
      const newIndex = columnTasks.findIndex((t) => t.id === over.id);

      if (oldIndex !== newIndex) {
        const newColumn = arrayMove(columnTasks, oldIndex, newIndex);
        setItems((prev) =>
          prev.filter((t) => t.status !== activeTaskItem.status).concat(newColumn),
        );
      }
    } else if (overTask && overTask.status !== activeTaskItem.status) {
      const newStatus = overTask.status;
      moveTask(active.id as string, newStatus);
    } else if (overType === "column") {
      const newStatus = over.id as TaskStatus;
      moveTask(active.id as string, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <section className="pb-24">
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          On mobile, press and hold the grip icon to drag a task to another column.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((col) => {
            return (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={grouped[col.id]}
                onMove={moveTask}
              />
            );
          })}
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? (
            <div className="rotate-2 scale-105 shadow-2xl">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>

        {pending ? (
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Updating status...
          </div>
        ) : null}
      </section>
    </DndContext>
  );
}
