import { getTemplatesPageData } from "@/features/templates/application/get-templates-page-data";
import TemplatesPageScreen from "@/features/templates/presentation/templates-page";

import {
  createTaskFromTemplateNow,
  createTemplate,
  deleteTemplate,
  toggleTemplateActive,
} from "./actions";

export default async function TemplatesPage() {
  const data = await getTemplatesPageData();

  return (
    <TemplatesPageScreen
      templates={data.templates}
      stats={data.stats}
      createTaskFromTemplateNowAction={createTaskFromTemplateNow}
      createTemplateAction={createTemplate}
      deleteTemplateAction={deleteTemplate}
      toggleTemplateActiveAction={toggleTemplateActive}
    />
  );
}
