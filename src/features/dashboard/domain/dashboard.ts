export function pct(completed: number, total: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function dayLabel(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function activityLabel(type: "STUDY" | "WORKOUT" | "DEEP_WORK" | "READING" | "OTHER") {
  if (type === "DEEP_WORK") return "Deep Work";
  return type.charAt(0) + type.slice(1).toLowerCase().replace("_", " ");
}
