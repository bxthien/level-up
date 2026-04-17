import { prisma } from "@/shared/db/prisma";

export function findTemplatesForOverview() {
  return prisma.taskTemplate.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "asc" }],
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });
}

export function createTemplate(data: {
  title: string;
  category: "WORK" | "SKILL" | "HEALTH" | "PERSONAL";
  priority: number;
  frequency: "DAILY" | "WEEKLY";
  weekDays: number | null;
  kpiTarget?: number;
  kpiUnit?: "MINUTES" | "COUNT";
}) {
  return prisma.taskTemplate.create({ data });
}

export function findTemplateById(id: string) {
  return prisma.taskTemplate.findUnique({ where: { id } });
}

export function findTemplateIsActive(id: string) {
  return prisma.taskTemplate.findUnique({
    where: { id },
    select: { isActive: true },
  });
}

export function updateTemplateActive(id: string, isActive: boolean) {
  return prisma.taskTemplate.update({
    where: { id },
    data: { isActive },
  });
}

export function deleteTemplateById(id: string) {
  return prisma.taskTemplate.delete({ where: { id } });
}
