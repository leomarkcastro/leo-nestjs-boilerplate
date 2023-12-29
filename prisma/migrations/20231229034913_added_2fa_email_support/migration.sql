/*
  Warnings:

  - You are about to drop the column `lastSuccessLogin` on the `LocalAuth` table. All the data in the column will be lost.
  - You are about to drop the column `lastTwoFaRequest` on the `LocalAuth` table. All the data in the column will be lost.
  - You are about to drop the column `remainingLoginAttempts` on the `LocalAuth` table. All the data in the column will be lost.
  - You are about to drop the column `twofa` on the `LocalAuth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LocalAuth" DROP COLUMN "lastSuccessLogin",
DROP COLUMN "lastTwoFaRequest",
DROP COLUMN "remainingLoginAttempts",
DROP COLUMN "twofa",
ADD COLUMN     "twofaEmail" BOOLEAN,
ADD COLUMN     "twofaEmailLastSent" TIMESTAMP(3),
ADD COLUMN     "twofaEmailSecret" TEXT;
