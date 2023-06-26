/*
  Warnings:

  - You are about to drop the column `age` on the `Individual` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Individual" DROP COLUMN "age",
ADD COLUMN     "birthOfDate" TIMESTAMP(3);
