import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctor = await prisma.doctorApplication.findFirst({
      where: {
        email: session.user.email
      },
      select: {
        id: true,
        status: true
      }
    });

    if (!doctor || doctor.status !== "APPROVED") {
      return NextResponse.json({ error: "Unauthorized doctor" }, { status: 403 });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id
      },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true
          }
        },
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        date: "asc"
      }
    });

    const formattedAppointments = appointments.map((appointment) => {
      return {
        id: appointment.id,
        date: appointment.date,
        status: appointment.status,
        doctor: appointment.doctor,
        patientName: appointment.patient
          ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
          : "",
        patientEmail: appointment.patient?.email || "",
        patientPhone: appointment.patient?.phone || ""
      };
    });

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
