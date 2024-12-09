/*
  Warnings:

  - You are about to drop the column `department` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "faculty" DROP COLUMN "department";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "department";
