/*
  Warnings:

  - Added the required column `patientName` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "patientName" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
