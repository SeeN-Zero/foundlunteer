/*
  Warnings:

  - You are about to drop the column `userListId` on the `Individual` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Individual" DROP COLUMN "userListId";

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3),
    "expireAt" TIMESTAMP(3),

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_email_key" ON "Token"("email");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
