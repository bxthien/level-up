import { z } from "zod";

import { startOfLocalDay } from "@/shared/lib/day";

import { createActivityLog as createActivityLogRecord, deleteActivityLogById } from "../infrastructure/dashboard.repository";

const createActivityLogSchema = z.object({
  type: z.enum(["STUDY", "WORKOUT", "DEEP_WORK", "READING", "OTHER"]),
  minutes: z.coerce.number().int().min(0).max(1440).optional(),
  count: z.coerce.number().int().min(0).max(100000).optional(),
  note: z.string().trim().max(280).optional(),
});

export function parseCreateActivityLogInput(raw: Record<string, unknown>) {
  const parsed = createActivityLogSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid activity log input");
  return parsed.data;
}

export async function createActivityLog(input: {
  type: "STUDY" | "WORKOUT" | "DEEP_WORK" | "READING" | "OTHER";
  minutes?: number;
  count?: number;
  note?: string;
}) {
  return createActivityLogRecord({
    day: startOfLocalDay(new Date()),
    type: input.type,
    minutes: input.minutes,
    count: input.count,
    note: input.note ?? "",
  });
}

const deleteActivityLogSchema = z.object({
  id: z.string().min(1),
});

export function parseDeleteActivityLogInput(raw: Record<string, unknown>) {
  const parsed = deleteActivityLogSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid activity log id");
  return parsed.data;
}

export async function deleteActivityLog(id: string) {
  return deleteActivityLogById(id);
}
