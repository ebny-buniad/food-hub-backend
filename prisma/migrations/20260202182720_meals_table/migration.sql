/*
  Warnings:

  - You are about to drop the `DietaryPreference` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Meals" ADD COLUMN     "dietary" "DietaryPreferences" DEFAULT 'HALAL';

-- DropTable
DROP TABLE "DietaryPreference";
