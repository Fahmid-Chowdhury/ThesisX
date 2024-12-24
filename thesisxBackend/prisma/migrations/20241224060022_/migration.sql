-- CreateTable
CREATE TABLE "invitation" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "thesisId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitation_code_key" ON "invitation"("code");

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_thesisId_fkey" FOREIGN KEY ("thesisId") REFERENCES "thesis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
