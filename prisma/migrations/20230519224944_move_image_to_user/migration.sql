/*
  Warnings:

  - You are about to drop the column `image` on the `Individual` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Individual" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" BOOLEAN;
