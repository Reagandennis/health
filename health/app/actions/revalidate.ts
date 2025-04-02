"use server";
import { revalidatePath } from "next/cache";

export async function revalidateDoctorDashboard() {
  revalidatePath("/dashboard/doctor");
}
