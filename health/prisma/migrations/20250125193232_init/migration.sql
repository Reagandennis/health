-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MedicalSpecialization" AS ENUM ('GENERAL_PRACTICE', 'PSYCHIATRY', 'PSYCHOLOGY', 'COUNSELING', 'BEHAVIORAL_THERAPY', 'CLINICAL_PSYCHOLOGY', 'CHILD_PSYCHOLOGY', 'OTHER');

-- CreateTable
CREATE TABLE "doctor_applications" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "specialization" "MedicalSpecialization" NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL,
    "education" TEXT NOT NULL,
    "currentWorkplace" TEXT,
    "bio" TEXT NOT NULL,
    "credentials" JSONB,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "doctor_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_applications_email_key" ON "doctor_applications"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_applications_licenseNumber_key" ON "doctor_applications"("licenseNumber");
