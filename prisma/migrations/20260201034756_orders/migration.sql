-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "paymentMethod" SET DEFAULT 'Cash';
