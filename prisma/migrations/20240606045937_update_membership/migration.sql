/*
  Warnings:

  - Added the required column `createdAmount` to the `memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soldAmount` to the `memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenId` to the `memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `memberships` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "memberships" ADD COLUMN     "createdAmount" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creatorId" INTEGER NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "soldAmount" INTEGER NOT NULL,
ADD COLUMN     "tokenId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "ownerships" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "membershipId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "ownerships_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ownerships" ADD CONSTRAINT "ownerships_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ownerships" ADD CONSTRAINT "ownerships_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "memberships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
