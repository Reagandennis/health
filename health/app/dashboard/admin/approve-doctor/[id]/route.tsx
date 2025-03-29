'use client';

import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { prisma } from "../../../../../lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the user session
    const session = await getSession();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Missing doctor application ID" },
        { status: 400 }
      );
    }

    // Check if doctor application exists
    const doctorApplication = await prisma.doctorApplication.findUnique({
      where: { id },
    });

    if (!doctorApplication) {
      return NextResponse.json(
        { error: "Doctor application not found" },
        { status: 404 }
      );
    }

    // Update the doctor application status to APPROVED
    const updatedDoctor = await prisma.doctorApplication.update({
      where: { id },
      data: {
        status: ApplicationStatus.APPROVED,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Doctor application approved successfully",
        doctor: updatedDoctor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving doctor application:", error);
    return NextResponse.json(
      { error: "Failed to approve doctor application" },
      { status: 500 }
    );
  }
}
