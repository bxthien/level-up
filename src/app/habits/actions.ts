"use server";

import { revalidatePath } from "next/cache";

import {
  adjustHabitCheck as adjustHabitCheckCommand,
  createHabit as createHabitCommand,
  deleteHabit as deleteHabitCommand,
  parseAdjustHabitCheckInput,
  parseCreateHabitInput,
  parseHabitIdInput,
  toggleHabitActive as toggleHabitActiveCommand,
} from "@/features/habits/application/commands";

export async function createHabit(formData: FormData) {
  const input = parseCreateHabitInput(
    {
      title: formData.get("title"),
      frequency: formData.get("frequency"),
      targetPerPeriod: formData.get("targetPerPeriod"),
    },
    formData.getAll("weekDays"),
  );

  await createHabitCommand(input);
  revalidatePath("/habits");
}

export async function adjustHabitCheck(formData: FormData) {
  const input = parseAdjustHabitCheckInput({
    habitId: formData.get("habitId"),
    delta: formData.get("delta"),
  });

  await adjustHabitCheckCommand(input.habitId, input.delta);
  revalidatePath("/habits");
}

export async function toggleHabitActive(formData: FormData) {
  const input = parseHabitIdInput({ habitId: formData.get("habitId") });
  await toggleHabitActiveCommand(input.habitId);
  revalidatePath("/habits");
}

export async function deleteHabit(formData: FormData) {
  const input = parseHabitIdInput({ habitId: formData.get("habitId") });
  await deleteHabitCommand(input.habitId);
  revalidatePath("/habits");
}
