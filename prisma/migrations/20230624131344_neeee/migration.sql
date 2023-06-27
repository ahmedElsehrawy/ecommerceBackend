/*
  Warnings:

  - You are about to alter the column `averageRatingValue` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "averageRatingValue" SET DEFAULT 0,
ALTER COLUMN "averageRatingValue" SET DATA TYPE INTEGER;
