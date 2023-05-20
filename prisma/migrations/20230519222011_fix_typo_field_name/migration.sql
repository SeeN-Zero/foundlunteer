/*
  Warnings:

  - You are about to drop the column `izasah` on the `Individual` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Individual" DROP COLUMN "izasah",
ADD COLUMN     "ijazah" BOOLEAN;
