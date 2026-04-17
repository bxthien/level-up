import { prisma } from "../src/shared/db/prisma";
import { startOfLocalDay } from "../src/shared/lib/day";
import { weekDayBit } from "../src/shared/lib/recurrence";

async function main() {
  const today = startOfLocalDay(new Date());
  const todayBit = weekDayBit(today);

  const templates = await prisma.taskTemplate.findMany({
    where: { isActive: true },
  });

  let sortOrderCursor =
    ((await prisma.task.aggregate({
      where: { plannedFor: today, status: "TODO" },
      _max: { sortOrder: true },
    }))._max.sortOrder ?? -1) + 1;

  for (const tpl of templates) {
    if (tpl.frequency === "WEEKLY") {
      if (tpl.weekDays != null && (tpl.weekDays & todayBit) === 0) continue;
      if (tpl.weekDays == null) continue; // weekly templates should specify days
    }

    if (tpl.frequency === "DAILY") {
      if (tpl.weekDays != null && (tpl.weekDays & todayBit) === 0) continue;
    }

    const existing = await prisma.task.findFirst({
      where: { templateId: tpl.id, plannedFor: today },
      select: { id: true },
    });
    if (existing) continue;

    await prisma.task.create({
      data: {
        title: tpl.title,
        category: tpl.category,
        priority: tpl.priority,
        sortOrder: sortOrderCursor++,
        kpiTarget: tpl.kpiTarget,
        kpiUnit: tpl.kpiUnit,
        plannedFor: today,
        templateId: tpl.id,
      },
    });
  }

  console.log(`Generated tasks for ${today.toISOString().slice(0, 10)}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
