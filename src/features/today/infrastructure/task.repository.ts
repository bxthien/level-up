import { prisma } from "@/shared/db/prisma";

import type { CreateTaskInput, OrderedTaskInput, TaskStatus, TodayTask } from "../domain/task";

export async function findTasksForDayRange(start: Date, end: Date): Promise<TodayTask[]> {
  return prisma.task.findMany({
    where: {
      plannedFor: { gte: start, lte: end },
    },
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }, { priority: "desc" }, { createdAt: "asc" }],
  }) as Promise<TodayTask[]>;
}

export async function findNextSortOrderForDayStatus(day: Date, status: TaskStatus) {
  const result = await prisma.task.aggregate({
    where: { plannedFor: day, status },
    _max: { sortOrder: true },
  });

  return (result._max.sortOrder ?? -1) + 1;
}

export async function createTaskForDay(day: Date, input: CreateTaskInput, sortOrder: number) {
  return prisma.task.create({
    data: {
      title: input.title,
      category: input.category,
      priority: input.priority,
      sortOrder,
      kpiTarget: input.kpiTarget,
      kpiUnit: input.kpiUnit,
      plannedFor: day,
    },
  });
}

export async function findTaskStatusContext(id: string) {
  return prisma.task.findUnique({
    where: { id },
    select: { plannedFor: true, status: true },
  });
}

export async function updateTaskStatusAndMaybeSortOrder(
  id: string,
  status: TaskStatus,
  sortOrder?: number,
) {
  return prisma.task.update({
    where: { id },
    data: {
      status,
      ...(sortOrder != null ? { sortOrder } : {}),
    },
  });
}

export async function updateTaskActual(id: string, kpiActual: number) {
  return prisma.task.update({
    where: { id },
    data: { kpiActual },
  });
}

export async function deleteTaskById(id: string) {
  return prisma.task.delete({ where: { id } });
}

export async function persistOrderedTasks(orderedTasks: OrderedTaskInput[]) {
  return prisma.$transaction(
    orderedTasks.map((task) =>
      prisma.task.update({
        where: { id: task.id },
        data: { status: task.status, sortOrder: task.sortOrder },
      }),
    ),
  );
}
