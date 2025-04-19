/*
  Warnings:

  - The `categories` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "categories",
ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];
