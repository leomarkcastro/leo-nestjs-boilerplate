-- CreateTable
CREATE TABLE "TaskOnEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT,
    "taskId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "TaskOnEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskOnEvent_taskId_eventId_key" ON "TaskOnEvent"("taskId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskOnEvent_taskId_eventId_type_key" ON "TaskOnEvent"("taskId", "eventId", "type");

-- AddForeignKey
ALTER TABLE "TaskOnEvent" ADD CONSTRAINT "TaskOnEvent_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskOnEvent" ADD CONSTRAINT "TaskOnEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
