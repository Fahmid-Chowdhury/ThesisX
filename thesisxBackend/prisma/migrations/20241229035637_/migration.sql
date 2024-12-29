-- CreateEnum
CREATE TYPE "requestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "request_supervisor" ADD COLUMN     "status" "requestStatus" NOT NULL DEFAULT 'PENDING';
