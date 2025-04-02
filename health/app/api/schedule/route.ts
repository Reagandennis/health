import { NextResponse } from "next/server";

interface Appointment {
  selectedDoctor: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export async function POST(req: Request) {
  try {
    const body: Appointment = await req.json();
    const { selectedDoctor, appointmentDate, appointmentTime, notes } = body;

    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Simulate saving the appointment (Replace with actual DB call)
    console.log("New Appointment: ", body);
    
    return NextResponse.json({ message: "Appointment scheduled successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to schedule appointment" }, { status: 500 });
  }
}
