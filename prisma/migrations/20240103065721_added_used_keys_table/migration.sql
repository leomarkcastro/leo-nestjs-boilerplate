-- CreateTable
CREATE TABLE "UsedKeys" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT,

    CONSTRAINT "UsedKeys_pkey" PRIMARY KEY ("id")
);
