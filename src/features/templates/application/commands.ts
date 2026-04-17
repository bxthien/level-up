import { z } from "zod";

import { startOfLocalDay } from "@/shared/lib/day";
import { buildWeekDaysMask } from "@/shared/lib/recurrence";

import { createTaskForDay, findNextSortOrderForDayStatus } from "@/features/today/infrastructure/task.repository";
import {
  createTemplate as createTemplateRecord,
  deleteTemplateById,
  findTemplateById,
  findTemplateIsActive,
  updateTemplateActive,
} from "../infrastructure/template.repository";

const createTemplateSchema = z.object({
  title: z.string().trim().min(1).max(140),
  category: z.enum(["WORK", "SKILL", "HEALTH", "PERSONAL"]),
  priority: z.coerce.number().int().min(1).max(5).default(3),
  frequency: z.enum(["DAILY", "WEEKLY"]),
  kpiTarget: z.coerce.number().int().min(1).max(100000).optional(),
  kpiUnit: z.enum(["MINUTES", "COUNT"]).optional(),
});

export function parseCreateTemplateInput(raw: Record<string, unknown>, weekDays: FormDataEntryValue[]) {
  const parsed = createTemplateSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid template input");

  return {
    ...parsed.data,
    weekDays: buildWeekDaysMask(weekDays),
  };
}

export async function createTemplate(input: {
  title: string;
  category: "WORK" | "SKILL" | "HEALTH" | "PERSONAL";
  priority: number;
  frequency: "DAILY" | "WEEKLY";
  weekDays: number | null;
  kpiTarget?: number;
  kpiUnit?: "MINUTES" | "COUNT";
}) {
  return createTemplateRecord(input);
}

const templateIdSchema = z.object({
  templateId: z.string().min(1),
});

export function parseTemplateIdInput(raw: Record<string, unknown>) {
  const parsed = templateIdSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid template id");
  return parsed.data;
}

export async function toggleTemplateActive(templateId: string) {
  const template = await findTemplateIsActive(templateId);
  if (!template) throw new Error("Template not found");
  return updateTemplateActive(templateId, !template.isActive);
}

export async function deleteTemplate(templateId: string) {
  return deleteTemplateById(templateId);
}

export async function createTaskFromTemplateNow(templateId: string) {
  const template = await findTemplateById(templateId);
  if (!template) throw new Error("Template not found");

  const today = startOfLocalDay(new Date());
  const sortOrder = await findNextSortOrderForDayStatus(today, "TODO");

  return createTaskForDay(
    today,
    {
      title: template.title,
      category: template.category,
      priority: template.priority,
      kpiTarget: template.kpiTarget ?? undefined,
      kpiUnit: template.kpiUnit ?? undefined,
    },
    sortOrder,
  );
}
