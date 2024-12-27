-- AlterTable
ALTER TABLE "post" ADD COLUMN     "thesisId" INTEGER;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_thesisId_fkey" FOREIGN KEY ("thesisId") REFERENCES "thesis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
