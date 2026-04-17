"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  defaultDropAnimationSideEffects,
  type DragEndEvent,
  type DragStartEvent,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { OrderedTaskInput, TaskStatus, TodayTask } from "../domain/task";

type Props = {
  tasks: TodayTask[];
  deleteTaskAction: (formData: FormData) => Promise<void>;
  persistTaskOrderAction: (orderedTasks: OrderedTaskInput[]) => Promise<void>;
  updateTaskActualAction: (formData: FormData) => Promise<void>;
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
  deleteTaskAction,
  isDragging,
  onMove,
  updateTaskActualAction,
  dragHandle,
}: {
  task: TodayTask;
  deleteTaskAction: (formData: FormData) => Promise<void>;
  isDragging?: boolean;
  onMove?: (id: string, status: TaskStatus) => void;
  updateTaskActualAction: (formData: FormData) => Promise<void>;
  dragHandle?: React.ReactNode;
}) {
  const hasKpi = task.kpiTarget != null && task.kpiUnit != null;
  const kpiTarget = task.kpiTarget ?? 0;
  const kpiUnit = task.kpiUnit;
  const pct =
    hasKpi && kpiTarget > 0
      ? Math.min(100, Math.round((task.kpiActual / kpiTarget) * 100))
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
          <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{task.title}</div>
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={[
                "rounded-full border px-2 py-0.5 text-[11px]",
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
              KPI: {formatKpi(kpiUnit, task.kpiActual)} / {formatKpi(kpiUnit, kpiTarget)}
            </span>
            {pct != null ? (
              <span className="font-medium text-violet-600 dark:text-violet-400">{pct}%</span>
            ) : null}
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
              style={{ width: `${pct ?? 0}%` }}
            />
          </div>
        </div>
      ) : null}

      {hasKpi ? (
        <form action={updateTaskActualAction} className="mt-2.5 flex items-center gap-2">
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

      <form action={deleteTaskAction} className="mt-2">
        <input type="hidden" name="id" value={task.id} />
        <button className="text-xs text-slate-500 transition hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400">
          Delete
        </button>
      </form>

      <div className="mt-2 flex flex-wrap gap-1 sm:hidden">
        {(["TODO", "DOING", "DONE"] as const).map((next) => {
          if (next === task.status) return null;
          const label = next === "TODO" ? "To Do" : next === "DOING" ? "Doing" : "Done";
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

function SortableTaskCard({
  task,
  deleteTaskAction,
  onMove,
  updateTaskActualAction,
}: {
  task: TodayTask;
  deleteTaskAction: (formData: FormData) => Promise<void>;
  onMove: (id: string, status: TaskStatus) => void;
  updateTaskActualAction: (formData: FormData) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <TaskCard
        task={task}
        deleteTaskAction={deleteTaskAction}
        isDragging={isDragging}
        onMove={onMove}
        updateTaskActualAction={updateTaskActualAction}
        dragHandle={
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="flex h-8 w-8 touch-none cursor-grab items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing dark:hover:bg-slate-700 dark:hover:text-slate-200"
            aria-label="Drag to move"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </button>
        }
      />
    </div>
  );
}

function toOrderedPayload(items: TodayTask[]) {
  return columns.flatMap((column) =>
    items
      .filter((item) => item.status === column.id)
      .map((item, index) => ({
        id: item.id,
        status: item.status,
        sortOrder: index,
      })),
  );
}

function applyOrderedPayload(items: TodayTask[]) {
  const sortLookup = new Map(toOrderedPayload(items).map((item) => [item.id, item.sortOrder]));
  return items.map((item) => ({
    ...item,
    sortOrder: sortLookup.get(item.id) ?? item.sortOrder,
  }));
}

function insertAt<T>(items: T[], index: number, value: T) {
  const next = [...items];
  next.splice(index, 0, value);
  return next;
}

function buildItemsFromColumns(grouped: Record<TaskStatus, TodayTask[]>) {
  return columns.flatMap((column) =>
    grouped[column.id].map((task, index) => ({
      ...task,
      status: column.id,
      sortOrder: index,
    })),
  );
}

function KanbanColumn({
  column,
  deleteTaskAction,
  onMove,
  tasks,
  updateTaskActualAction,
}: {
  column: (typeof columns)[number];
  deleteTaskAction: (formData: FormData) => Promise<void>;
  onMove: (id: string, status: TaskStatus) => void;
  tasks: TodayTask[];
  updateTaskActualAction: (formData: FormData) => Promise<void>;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      status: column.id,
    },
  });

  return (
    <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
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
          <h3 className={["text-sm font-semibold", column.accent].join(" ")}>{column.label}</h3>
          <span
            className={[
              "rounded-full px-2 py-0.5 text-xs font-medium",
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
            <SortableTaskCard
              key={task.id}
              task={task}
              deleteTaskAction={deleteTaskAction}
              onMove={onMove}
              updateTaskActualAction={updateTaskActualAction}
            />
          ))}

          {tasks.length === 0 ? (
            <div
              className={[
                "rounded-xl border-2 border-dashed p-6 text-center text-xs opacity-70 transition-colors",
                column.borderLight,
                column.borderDark,
                isOver ? "bg-white/70 opacity-100 dark:bg-slate-800/40" : "",
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

export default function KanbanBoard({
  tasks,
  deleteTaskAction,
  persistTaskOrderAction,
  updateTaskActualAction,
}: Props) {
  const [items, setItems] = useState<TodayTask[]>(applyOrderedPayload(tasks));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setItems(applyOrderedPayload(tasks));
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
      TODO: items.filter((task) => task.status === "TODO"),
      DOING: items.filter((task) => task.status === "DOING"),
      DONE: items.filter((task) => task.status === "DONE"),
    }),
    [items],
  );

  const activeTask = useMemo(
    () => items.find((task) => task.id === activeId) ?? null,
    [items, activeId],
  );

  const persistOrder = (nextItems: TodayTask[]) => {
    startTransition(async () => {
      await persistTaskOrderAction(toOrderedPayload(nextItems));
    });
  };

  const moveTask = (id: string, status: TaskStatus) => {
    const moving = items.find((task) => task.id === id);
    if (!moving || moving.status === status) return;

    const nextItems = applyOrderedPayload(
      items.map((task) => (task.id === id ? { ...task, status } : task)),
    );
    setItems(nextItems);
    persistOrder(nextItems);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTaskItem = items.find((task) => task.id === active.id);
    if (!activeTaskItem) return;

    const overTask = items.find((task) => task.id === over.id);
    const overType = over.data.current?.type;
    const groupedItems: Record<TaskStatus, TodayTask[]> = {
      TODO: items.filter((task) => task.status === "TODO"),
      DOING: items.filter((task) => task.status === "DOING"),
      DONE: items.filter((task) => task.status === "DONE"),
    };

    if (overTask && overTask.status === activeTaskItem.status) {
      const columnTasks = groupedItems[activeTaskItem.status];
      const oldIndex = columnTasks.findIndex((task) => task.id === active.id);
      const newIndex = columnTasks.findIndex((task) => task.id === over.id);

      if (oldIndex !== newIndex) {
        const nextItems = buildItemsFromColumns({
          ...groupedItems,
          [activeTaskItem.status]: arrayMove(columnTasks, oldIndex, newIndex),
        });
        setItems(nextItems);
        persistOrder(nextItems);
      }
    } else if (overTask && overTask.status !== activeTaskItem.status) {
      const sourceStatus = activeTaskItem.status;
      const targetStatus = overTask.status;
      const sourceItems = groupedItems[sourceStatus].filter((task) => task.id !== active.id);
      const targetItems = groupedItems[targetStatus];
      const insertIndex = targetItems.findIndex((task) => task.id === over.id);

      const nextItems = buildItemsFromColumns({
        ...groupedItems,
        [sourceStatus]: sourceItems,
        [targetStatus]: insertAt(targetItems, insertIndex, {
          ...activeTaskItem,
          status: targetStatus,
        }),
      });
      setItems(nextItems);
      persistOrder(nextItems);
    } else if (overType === "column") {
      const sourceStatus = activeTaskItem.status;
      const targetStatus = over.id as TaskStatus;
      if (sourceStatus === targetStatus) return;

      const nextItems = buildItemsFromColumns({
        ...groupedItems,
        [sourceStatus]: groupedItems[sourceStatus].filter((task) => task.id !== active.id),
        [targetStatus]: [
          ...groupedItems[targetStatus],
          { ...activeTaskItem, status: targetStatus },
        ],
      });
      setItems(nextItems);
      persistOrder(nextItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event: DragStartEvent) => setActiveId(event.active.id as string)}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <section className="pb-24">
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          On mobile, press and hold the grip icon to drag a task to another column.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              deleteTaskAction={deleteTaskAction}
              onMove={moveTask}
              tasks={grouped[column.id]}
              updateTaskActualAction={updateTaskActualAction}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? (
            <div className="rotate-2 scale-105 shadow-2xl">
              <TaskCard
                task={activeTask}
                deleteTaskAction={deleteTaskAction}
                updateTaskActualAction={updateTaskActualAction}
              />
            </div>
          ) : null}
        </DragOverlay>

        {pending ? (
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Updating board...</div>
        ) : null}
      </section>
    </DndContext>
  );
}
