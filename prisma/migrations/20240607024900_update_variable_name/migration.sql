/*
  Warnings:

  - You are about to drop the column `offerMembershipId` on the `trade_requests` table. All the data in the column will be lost.
  - You are about to drop the column `requestMembershipId` on the `trade_requests` table. All the data in the column will be lost.
  - Added the required column `offeredId` to the `trade_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestedId` to the `trade_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "trade_requests" DROP CONSTRAINT "trade_requests_offerMembershipId_fkey";

-- DropForeignKey
ALTER TABLE "trade_requests" DROP CONSTRAINT "trade_requests_requestMembershipId_fkey";

-- AlterTable
ALTER TABLE "trade_requests" DROP COLUMN "offerMembershipId",
DROP COLUMN "requestMembershipId",
ADD COLUMN     "offeredId" INTEGER NOT NULL,
ADD COLUMN     "requestedId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "trade_requests" ADD CONSTRAINT "trade_requests_requestedId_fkey" FOREIGN KEY ("requestedId") REFERENCES "memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_requests" ADD CONSTRAINT "trade_requests_offeredId_fkey" FOREIGN KEY ("offeredId") REFERENCES "memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
