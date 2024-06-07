/*
  Warnings:

  - You are about to drop the column `declinedAt` on the `trade_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "trade_requests" DROP COLUMN "declinedAt";

-- CreateTable
CREATE TABLE "decline_requests" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "decline_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "decline_requests_requestId_userId_key" ON "decline_requests"("requestId", "userId");

-- AddForeignKey
ALTER TABLE "decline_requests" ADD CONSTRAINT "decline_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decline_requests" ADD CONSTRAINT "decline_requests_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "trade_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
