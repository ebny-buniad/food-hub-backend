/*
  Warnings:

  - You are about to drop the column `customer_id` on the `Reviews` table. All the data in the column will be lost.
  - You are about to drop the column `meal_id` on the `Reviews` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mealId` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_meal_id_fkey";

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "customer_id",
DROP COLUMN "meal_id",
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "mealId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
