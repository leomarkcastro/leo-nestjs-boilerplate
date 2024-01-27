-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "situtationBoardId" TEXT;

-- CreateTable
CREATE TABLE "SitutationBoard" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "bgColor" TEXT,
    "index" INTEGER NOT NULL,

    CONSTRAINT "SitutationBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFlags" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserFlags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_situtationBoardId_fkey" FOREIGN KEY ("situtationBoardId") REFERENCES "SitutationBoard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFlags" ADD CONSTRAINT "UserFlags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
