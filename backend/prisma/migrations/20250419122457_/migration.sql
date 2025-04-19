/*
  Warnings:

  - A unique constraint covering the columns `[chatId,userId]` on the table `ChatReview` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "categories" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "skills" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ChatReview_chatId_userId_key" ON "ChatReview"("chatId", "userId");
