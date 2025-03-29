import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this import if necessary

export async function GET() {
    try {
        const approvedDoctors = await prisma.doctorApplication.findMany({
            where: { status: "APPROVED" },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                specialization: true,
            },
        });

        return NextResponse.json(approvedDoctors, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching approved doctors", error: error.message }, { status: 500 });
    }
}
