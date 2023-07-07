-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_organizationId_fkey";

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
