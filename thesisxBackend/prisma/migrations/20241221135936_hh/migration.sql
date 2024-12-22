/*
  Warnings:

  - You are about to drop the column `availability` on the `faculty` table. All the data in the column will be lost.
  - Added the required column `available_slot` to the `faculty` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AvailabilityType" AS ENUM ('Online', 'Offline');

-- AlterTable
ALTER TABLE "faculty" DROP COLUMN "availability",
ADD COLUMN     "available_slot" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "thesisID" INTEGER;

-- CreateTable
CREATE TABLE "thesis" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "supervisorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "thesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability" (
    "id" SERIAL NOT NULL,
    "facultyId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "type" "AvailabilityType" NOT NULL,

    CONSTRAINT "availability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_thesisID_fkey" FOREIGN KEY ("thesisID") REFERENCES "thesis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thesis" ADD CONSTRAINT "thesis_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability" ADD CONSTRAINT "availability_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
