/*
  Warnings:

  - You are about to drop the column `userId` on the `Discount` table. All the data in the column will be lost.
  - Added the required column `vendorId` to the `Discount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_userId_fkey";

-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "userId",
ADD COLUMN     "vendorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
