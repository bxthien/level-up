"use server";

import { revalidatePath } from "next/cache";

import {
  createActivityLog as createActivityLogCommand,
  deleteActivityLog as deleteActivityLogCommand,
  parseCreateActivityLogInput,
  parseDeleteActivityLogInput,
} from "@/features/dashboard/application/commands";

export async function createActivityLog(formData: FormData) {
  const input = parseCreateActivityLogInput({
    type: formData.get("type"),
    minutes: formData.get("minutes") || undefined,
    count: formData.get("count") || undefined,
    note: formData.get("note") || undefined,
  });

  await createActivityLogCommand(input);
  revalidatePath("/dashboard");
}

export async function deleteActivityLog(formData: FormData) {
  const input = parseDeleteActivityLogInput({ id: formData.get("id") });
  await deleteActivityLogCommand(input.id);
  revalidatePath("/dashboard");
}
