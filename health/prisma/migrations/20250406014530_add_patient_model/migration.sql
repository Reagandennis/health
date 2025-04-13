/*
  Warnings:

  - You are about to drop the column `notes` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `patientName` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `appointments` table. All the data in the column will be lost.
  - The `status` column on the `appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `patientId` on table `appointments` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- Create default patients for existing appointments
WITH numbered_patients AS (
    SELECT 
        "patientName",
        ROW_NUMBER() OVER (PARTITION BY "patientName") as rn
    FROM "appointments"
    WHERE "patientId" IS NULL
)
INSERT INTO "Patient" ("id", "firstName", "lastName", "email", "dateOfBirth", "gender", "updatedAt")
SELECT 
    CASE 
        WHEN np.rn = 1 THEN CONCAT('pat_', np."patientName")
        ELSE CONCAT('pat_', np."patientName", '_', np.rn)
    END,
    SPLIT_PART(np."patientName", ' ', 1),
    COALESCE(NULLIF(SPLIT_PART(np."patientName", ' ', 2), ''), 'Unknown'),
    CASE 
        WHEN np.rn = 1 THEN CONCAT(LOWER(REPLACE(np."patientName", ' ', '.')), '@example.com')
        ELSE CONCAT(LOWER(REPLACE(np."patientName", ' ', '.')), '_', np.rn, '@example.com')
    END,
    CURRENT_TIMESTAMP,
    'Unknown',
    CURRENT_TIMESTAMP
FROM numbered_patients np;

-- Update appointments with new patient IDs
WITH numbered_appointments AS (
    SELECT 
        id,
        "patientName",
        ROW_NUMBER() OVER (PARTITION BY "patientName") as rn
    FROM "appointments"
    WHERE "patientId" IS NULL
)
UPDATE "appointments" a
SET "patientId" = CASE 
    WHEN na.rn = 1 THEN CONCAT('pat_', na."patientName")
    ELSE CONCAT('pat_', na."patientName", '_', na.rn)
END
FROM numbered_appointments na
WHERE a.id = na.id;

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "notes",
DROP COLUMN "patientName",
DROP COLUMN "type",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "patientId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
