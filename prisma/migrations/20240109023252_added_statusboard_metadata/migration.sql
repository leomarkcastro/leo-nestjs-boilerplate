-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "statusBoardId" TEXT,
ADD COLUMN     "statusBoardIndex" INTEGER;

-- CreateTable
CREATE TABLE "StatusBoard" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "StatusBoard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_statusBoardId_fkey" FOREIGN KEY ("statusBoardId") REFERENCES "StatusBoard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
