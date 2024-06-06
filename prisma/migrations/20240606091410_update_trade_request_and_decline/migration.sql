/*
  Warnings:

  - Added the required column `offerMembershipId` to the `trade_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestMembershipId` to the `trade_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trade_requests" ADD COLUMN     "offerMembershipId" INTEGER NOT NULL,
ADD COLUMN     "requestMembershipId" INTEGER NOT NULL;

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
ALTER TABLE "trade_requests" ADD CONSTRAINT "trade_requests_requestMembershipId_fkey" FOREIGN KEY ("requestMembershipId") REFERENCES "memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_requests" ADD CONSTRAINT "trade_requests_offerMembershipId_fkey" FOREIGN KEY ("offerMembershipId") REFERENCES "memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decline_requests" ADD CONSTRAINT "decline_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decline_requests" ADD CONSTRAINT "decline_requests_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "trade_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
