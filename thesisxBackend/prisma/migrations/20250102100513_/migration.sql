-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('Normal', 'P1', 'P2', 'Final');

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "type" "SubmissionType" NOT NULL,
    "file" TEXT NOT NULL,
    "thesisId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_thesisId_fkey" FOREIGN KEY ("thesisId") REFERENCES "thesis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
