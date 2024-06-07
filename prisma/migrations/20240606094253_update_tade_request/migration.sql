/*
  Warnings:

  - You are about to drop the `decline_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "decline_requests" DROP CONSTRAINT "decline_requests_requestId_fkey";

-- DropForeignKey
ALTER TABLE "decline_requests" DROP CONSTRAINT "decline_requests_userId_fkey";

-- AlterTable
ALTER TABLE "trade_requests" ADD COLUMN     "declinedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "decline_requests";
