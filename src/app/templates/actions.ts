"use server";

import { revalidatePath } from "next/cache";

import {
  createTaskFromTemplateNow as createTaskFromTemplateNowCommand,
  createTemplate as createTemplateCommand,
  deleteTemplate as deleteTemplateCommand,
  parseCreateTemplateInput,
  parseTemplateIdInput,
  toggleTemplateActive as toggleTemplateActiveCommand,
} from "@/features/templates/application/commands";

export async function createTemplate(formData: FormData) {
  const input = parseCreateTemplateInput(
    {
      title: formData.get("title"),
      category: formData.get("category"),
      priority: formData.get("priority"),
      frequency: formData.get("frequency"),
      kpiTarget: formData.get("kpiTarget") || undefined,
      kpiUnit: formData.get("kpiUnit") || undefined,
    },
    formData.getAll("weekDays"),
  );

  await createTemplateCommand(input);
  revalidatePath("/templates");
}

export async function toggleTemplateActive(formData: FormData) {
  const input = parseTemplateIdInput({ templateId: formData.get("templateId") });
  await toggleTemplateActiveCommand(input.templateId);
  revalidatePath("/templates");
}

export async function deleteTemplate(formData: FormData) {
  const input = parseTemplateIdInput({ templateId: formData.get("templateId") });
  await deleteTemplateCommand(input.templateId);
  revalidatePath("/templates");
}

export async function createTaskFromTemplateNow(formData: FormData) {
  const input = parseTemplateIdInput({ templateId: formData.get("templateId") });
  await createTaskFromTemplateNowCommand(input.templateId);
  revalidatePath("/templates");
  revalidatePath("/today");
}
