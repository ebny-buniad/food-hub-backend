/*
  Warnings:

  - A unique constraint covering the columns `[cuisine]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Categories" ALTER COLUMN "cuisine" SET NOT NULL,
ALTER COLUMN "cuisine" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Categories_cuisine_key" ON "Categories"("cuisine");
