export type TaskCategory = "WORK" | "SKILL" | "HEALTH" | "PERSONAL";
export type TaskStatus = "TODO" | "DOING" | "DONE";
export type KpiUnit = "MINUTES" | "COUNT";

export type TodayTask = {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: number;
  sortOrder: number;
  kpiTarget: number | null;
  kpiUnit: KpiUnit | null;
  kpiActual: number;
};

export type CreateTaskInput = {
  title: string;
  category: TaskCategory;
  priority: number;
  kpiTarget?: number;
  kpiUnit?: KpiUnit;
};

export type OrderedTaskInput = {
  id: string;
  status: TaskStatus;
  sortOrder: number;
};

export type TodayBoardData = {
  dayKey: string;
  tasks: TodayTask[];
  stats: {
    doneCount: number;
    doingCount: number;
    todoCount: number;
    progressPct: number;
  };
};
