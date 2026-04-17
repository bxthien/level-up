import { z } from "zod";

import { startOfLocalDay } from "@/shared/lib/day";

import type { CreateTaskInput, OrderedTaskInput, TaskStatus } from "../domain/task";
import {
  createTaskForDay,
  deleteTaskById,
  findNextSortOrderForDayStatus,
  findTaskStatusContext,
  persistOrderedTasks,
  updateTaskActual as saveTaskActual,
  updateTaskStatusAndMaybeSortOrder,
} from "../infrastructure/task.repository";

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(140),
  category: z.enum(["WORK", "SKILL", "HEALTH", "PERSONAL"]),
  priority: z.coerce.number().int().min(1).max(5).default(3),
  kpiTarget: z.coerce.number().int().min(1).max(100000).optional(),
  kpiUnit: z.enum(["MINUTES", "COUNT"]).optional(),
});

export function parseCreateTaskInput(raw: Record<string, unknown>): CreateTaskInput {
  const parsed = createTaskSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid task input");
  return parsed.data;
}

export async function createTask(input: CreateTaskInput) {
  const today = startOfLocalDay(new Date());
  const sortOrder = await findNextSortOrderForDayStatus(today, "TODO");
  return createTaskForDay(today, input, sortOrder);
}

const updateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["TODO", "DOING", "DONE"]),
});

export function parseUpdateTaskStatusInput(raw: Record<string, unknown>) {
  const parsed = updateStatusSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid status input");
  return parsed.data;
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const task = await findTaskStatusContext(id);
  if (!task) throw new Error("Task not found");

  const sortOrder =
    task.status === status
      ? undefined
      : await findNextSortOrderForDayStatus(task.plannedFor, status);

  return updateTaskStatusAndMaybeSortOrder(id, status, sortOrder);
}

const updateActualSchema = z.object({
  id: z.string().min(1),
  kpiActual: z.coerce.number().int().min(0).max(100000),
});

export function parseUpdateTaskActualInput(raw: Record<string, unknown>) {
  const parsed = updateActualSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid actual input");
  return parsed.data;
}

export async function updateTaskActual(id: string, kpiActual: number) {
  return saveTaskActual(id, kpiActual);
}

const deleteTaskSchema = z.object({
  id: z.string().min(1),
});

export function parseDeleteTaskInput(raw: Record<string, unknown>) {
  const parsed = deleteTaskSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid delete input");
  return parsed.data;
}

export async function deleteTask(id: string) {
  return deleteTaskById(id);
}

const persistTaskOrderSchema = z.object({
  orderedTasks: z.array(
    z.object({
      id: z.string().min(1),
      status: z.enum(["TODO", "DOING", "DONE"]),
      sortOrder: z.number().int().min(0),
    }),
  ),
});

export function parseOrderedTasksInput(orderedTasks: OrderedTaskInput[]) {
  const parsed = persistTaskOrderSchema.safeParse({ orderedTasks });
  if (!parsed.success) throw new Error("Invalid task order payload");
  return parsed.data.orderedTasks;
}

export async function updateTaskOrder(orderedTasks: OrderedTaskInput[]) {
  return persistOrderedTasks(orderedTasks);
}
