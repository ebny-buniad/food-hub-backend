/*
  Warnings:

  - You are about to drop the column `meal_id` on the `OrderItems` table. All the data in the column will be lost.
  - You are about to drop the column `order_ID` on the `OrderItems` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mealId` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderID` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_meal_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_order_ID_fkey";

-- AlterTable
ALTER TABLE "OrderItems" DROP COLUMN "meal_id",
DROP COLUMN "order_ID",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "mealId" TEXT NOT NULL,
ADD COLUMN     "orderID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
