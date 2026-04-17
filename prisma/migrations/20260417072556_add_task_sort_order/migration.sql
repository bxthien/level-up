-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" INTEGER NOT NULL DEFAULT 3,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "kpiTarget" INTEGER,
    "kpiUnit" TEXT,
    "kpiActual" INTEGER NOT NULL DEFAULT 0,
    "plannedFor" DATETIME NOT NULL,
    "templateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "TaskTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("category", "createdAt", "id", "kpiActual", "kpiTarget", "kpiUnit", "plannedFor", "priority", "status", "templateId", "title", "updatedAt") SELECT "category", "createdAt", "id", "kpiActual", "kpiTarget", "kpiUnit", "plannedFor", "priority", "status", "templateId", "title", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE INDEX "Task_plannedFor_idx" ON "Task"("plannedFor");
CREATE INDEX "Task_status_idx" ON "Task"("status");
CREATE INDEX "Task_category_idx" ON "Task"("category");
CREATE INDEX "Task_templateId_idx" ON "Task"("templateId");
CREATE INDEX "Task_plannedFor_status_sortOrder_idx" ON "Task"("plannedFor", "status", "sortOrder");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
