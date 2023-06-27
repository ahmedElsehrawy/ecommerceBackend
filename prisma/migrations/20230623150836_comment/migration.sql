-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "commetnText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);
