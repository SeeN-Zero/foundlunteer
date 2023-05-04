/*
  Warnings:

  - Made the column `createdAt` on table `Token` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expireAt` on table `Token` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `Token` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "expireAt" SET NOT NULL,
ALTER COLUMN "code" SET NOT NULL;
