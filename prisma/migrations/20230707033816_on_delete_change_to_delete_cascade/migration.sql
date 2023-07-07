-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_individualId_fkey";

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_jobId_fkey";

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "Individual"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
