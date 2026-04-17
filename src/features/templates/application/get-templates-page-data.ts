import { formatWeekDays } from "@/shared/lib/recurrence";

import { findTemplatesForOverview } from "../infrastructure/template.repository";

export const templateCategories = [
  { id: "WORK", label: "Work" },
  { id: "SKILL", label: "Skill" },
  { id: "HEALTH", label: "Health" },
  { id: "PERSONAL", label: "Personal" },
] as const;

export async function getTemplatesPageData() {
  const templates = await findTemplatesForOverview();

  return {
    templates: templates.map((template) => ({
      ...template,
      scheduleLabel: formatWeekDays(template.weekDays),
    })),
    stats: {
      totalCount: templates.length,
      activeCount: templates.filter((template) => template.isActive).length,
      generatedCount: templates.reduce((sum, template) => sum + template._count.tasks, 0),
    },
  };
}
