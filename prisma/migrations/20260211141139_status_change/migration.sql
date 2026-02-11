/*
  Warnings:

  - The values [ABANDONED] on the enum `CartStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PREPARING] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CartStatus_new" AS ENUM ('ACTIVE', 'ORDERED');
ALTER TABLE "public"."Cart" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Cart" ALTER COLUMN "status" TYPE "CartStatus_new" USING ("status"::text::"CartStatus_new");
ALTER TYPE "CartStatus" RENAME TO "CartStatus_old";
ALTER TYPE "CartStatus_new" RENAME TO "CartStatus";
DROP TYPE "public"."CartStatus_old";
ALTER TABLE "Cart" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PLACED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."Orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "Orders" ALTER COLUMN "status" SET DEFAULT 'PLACED';
COMMIT;
