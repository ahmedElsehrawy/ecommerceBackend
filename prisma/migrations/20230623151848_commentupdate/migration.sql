/*
  Warnings:

  - You are about to drop the column `commetnText` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `commentOwnerId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentText` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "commetnText",
ADD COLUMN     "commentOwnerId" INTEGER NOT NULL,
ADD COLUMN     "commentText" TEXT NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentOwnerId_fkey" FOREIGN KEY ("commentOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
