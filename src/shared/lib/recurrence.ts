import { endOfLocalDay, startOfLocalDay } from "@/shared/lib/day";

export const weekDayOptions = [
  { bit: 1, label: "Mon", formValue: "1" },
  { bit: 2, label: "Tue", formValue: "2" },
  { bit: 4, label: "Wed", formValue: "4" },
  { bit: 8, label: "Thu", formValue: "8" },
  { bit: 16, label: "Fri", formValue: "16" },
  { bit: 32, label: "Sat", formValue: "32" },
  { bit: 64, label: "Sun", formValue: "64" },
] as const;

export function weekDayBit(d: Date) {
  const js = d.getDay();
  const map = [64, 1, 2, 4, 8, 16, 32] as const;
  return map[js];
}

export function buildWeekDaysMask(values: FormDataEntryValue[]) {
  if (values.length === 0) return null;

  const mask = values.reduce((sum, value) => {
    const bit = Number(value);
    return Number.isInteger(bit) ? sum + bit : sum;
  }, 0);

  return mask > 0 ? mask : null;
}

export function formatWeekDays(mask: number | null) {
  if (mask == null) return "Every day";
  return weekDayOptions
    .filter((option) => (mask & option.bit) !== 0)
    .map((option) => option.label)
    .join(", ");
}

export function isScheduledForDay(mask: number | null, d: Date) {
  if (mask == null) return true;
  return (mask & weekDayBit(d)) !== 0;
}

export function startOfLocalWeek(d: Date) {
  const start = startOfLocalDay(d);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start;
}

export function endOfLocalWeek(d: Date) {
  const end = startOfLocalWeek(d);
  end.setDate(end.getDate() + 6);
  return endOfLocalDay(end);
}

export function addDays(d: Date, amount: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + amount);
  return next;
}
