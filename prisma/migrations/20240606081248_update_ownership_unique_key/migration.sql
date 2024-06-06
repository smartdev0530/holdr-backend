/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,membershipId]` on the table `ownerships` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ownerships_ownerId_membershipId_key" ON "ownerships"("ownerId", "membershipId");
