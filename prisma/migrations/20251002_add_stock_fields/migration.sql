-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK', 'LOW_STOCK', 'PRE_ORDER');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "stockQuantity" INTEGER NOT NULL DEFAULT 100;
ALTER TABLE "Product" ADD COLUMN "stockStatus" "StockStatus" NOT NULL DEFAULT 'IN_STOCK';

-- CreateIndex
CREATE INDEX "Product_stockStatus_idx" ON "Product"("stockStatus");
