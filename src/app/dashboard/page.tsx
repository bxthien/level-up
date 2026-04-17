import { getDashboardPageData } from "@/features/dashboard/application/get-dashboard-page-data";
import DashboardPageScreen from "@/features/dashboard/presentation/dashboard-page";

import { createActivityLog, deleteActivityLog } from "./actions";

export default async function DashboardPage() {
  const data = await getDashboardPageData();

  return (
    <DashboardPageScreen
      chartMaxMinutes={data.chartMaxMinutes}
      chartMaxTasks={data.chartMaxTasks}
      createActivityLogAction={createActivityLog}
      deleteActivityLogAction={deleteActivityLog}
      heatmapWeeks={data.heatmapWeeks}
      last7Days={data.last7Days}
      stats={data.stats}
      todayActivityLogs={data.todayActivityLogs}
    />
  );
}
