/*
  Warnings:

  - A unique constraint covering the columns `[calendarId,type,IsPublic]` on the table `CalendarOnUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CalendarOnUser" ADD COLUMN     "IsPublic" BOOLEAN DEFAULT false,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CalendarOnUser_calendarId_type_IsPublic_key" ON "CalendarOnUser"("calendarId", "type", "IsPublic");
