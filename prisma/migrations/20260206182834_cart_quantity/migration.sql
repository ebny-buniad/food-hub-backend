/*
  Warnings:

  - A unique constraint covering the columns `[cartId,mealId]` on the table `CartItems` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CartItems" ALTER COLUMN "quatity" SET DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "CartItems_cartId_mealId_key" ON "CartItems"("cartId", "mealId");
