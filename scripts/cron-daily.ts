import { prisma } from "../src/lib/db";
import { startOfLocalDay } from "../src/lib/day";

function weekDayBit(d: Date) {
  // JS: 0=Sun..6=Sat. Our bitmask: Mon=1..Sun=64
  const js = d.getDay();
  const map = [64, 1, 2, 4, 8, 16, 32] as const;
  return map[js];
}

async function main() {
  const today = startOfLocalDay(new Date());
  const todayBit = weekDayBit(today);

  const templates = await prisma.taskTemplate.findMany({
    where: { isActive: true },
  });

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

