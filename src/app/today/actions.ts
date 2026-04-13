"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { startOfLocalDay } from "@/lib/day";

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(140),
  category: z.enum(["WORK", "SKILL", "HEALTH", "PERSONAL"]),
  priority: z.coerce.number().int().min(1).max(5).default(3),
  kpiTarget: z.coerce.number().int().min(1).max(100000).optional(),
  kpiUnit: z.enum(["MINUTES", "COUNT"]).optional(),
});

export async function createTask(formData: FormData) {
  const parsed = createTaskSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    priority: formData.get("priority"),
    kpiTarget: formData.get("kpiTarget") || undefined,
    kpiUnit: formData.get("kpiUnit") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Invalid task input");
  }

  const today = startOfLocalDay(new Date());

  await prisma.task.create({
    data: {
      title: parsed.data.title,
      category: parsed.data.category,
      priority: parsed.data.priority,
      kpiTarget: parsed.data.kpiTarget,
      kpiUnit: parsed.data.kpiUnit,
      plannedFor: today,
    },
  });

  revalidatePath("/today");
}

const updateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["TODO", "DOING", "DONE"]),
});

export async function updateTaskStatus(formData: FormData) {
  const parsed = updateStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) throw new Error("Invalid status input");

  await prisma.task.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  });

  revalidatePath("/today");
}

const updateActualSchema = z.object({
  id: z.string().min(1),
  kpiActual: z.coerce.number().int().min(0).max(100000),
});

export async function updateTaskActual(formData: FormData) {
  const parsed = updateActualSchema.safeParse({
    id: formData.get("id"),
    kpiActual: formData.get("kpiActual"),
  });
  if (!parsed.success) throw new Error("Invalid actual input");

  await prisma.task.update({
    where: { id: parsed.data.id },
    data: { kpiActual: parsed.data.kpiActual },
  });

  revalidatePath("/today");
}

const deleteTaskSchema = z.object({ id: z.string().min(1) });

export async function deleteTask(formData: FormData) {
  const parsed = deleteTaskSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) throw new Error("Invalid delete input");

  await prisma.task.delete({ where: { id: parsed.data.id } });
  revalidatePath("/today");
}

