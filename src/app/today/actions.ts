"use server";

import { revalidatePath } from "next/cache";

import {
  createTask as createTaskCommand,
  deleteTask as deleteTaskCommand,
  parseCreateTaskInput,
  parseDeleteTaskInput,
  parseOrderedTasksInput,
  parseUpdateTaskActualInput,
  updateTaskActual as updateTaskActualCommand,
  updateTaskOrder,
} from "@/features/today/application/commands";
import type { OrderedTaskInput } from "@/features/today/domain/task";

export async function createTask(formData: FormData) {
  const input = parseCreateTaskInput({
    title: formData.get("title"),
    category: formData.get("category"),
    priority: formData.get("priority"),
    kpiTarget: formData.get("kpiTarget") || undefined,
    kpiUnit: formData.get("kpiUnit") || undefined,
  });

  await createTaskCommand(input);
  revalidatePath("/today");
}

export async function updateTaskActual(formData: FormData) {
  const input = parseUpdateTaskActualInput({
    id: formData.get("id"),
    kpiActual: formData.get("kpiActual"),
  });

  await updateTaskActualCommand(input.id, input.kpiActual);
  revalidatePath("/today");
}

export async function deleteTask(formData: FormData) {
  const input = parseDeleteTaskInput({ id: formData.get("id") });
  await deleteTaskCommand(input.id);
  revalidatePath("/today");
}

export async function persistTaskOrder(orderedTasks: OrderedTaskInput[]) {
  const input = parseOrderedTasksInput(orderedTasks);
  await updateTaskOrder(input);
  revalidatePath("/today");
}
