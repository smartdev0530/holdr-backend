-- DropForeignKey
ALTER TABLE "ownerships" DROP CONSTRAINT "ownerships_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "ownerships" DROP CONSTRAINT "ownerships_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "ownerships" ADD CONSTRAINT "ownerships_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ownerships" ADD CONSTRAINT "ownerships_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
