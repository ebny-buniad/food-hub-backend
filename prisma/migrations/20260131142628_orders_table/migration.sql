/*
  Warnings:

  - You are about to drop the column `restaurentId` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `providerId` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_restaurentId_fkey";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "restaurentId",
ADD COLUMN     "providerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
