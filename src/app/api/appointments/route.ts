import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

function getUserId(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const appointments = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: { doctor: true },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Appointments GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { doctorId, date, reason, notes } = body as { doctorId: string; date: string; reason?: string; notes?: string };
    if (!doctorId || !date) return NextResponse.json({ message: "Missing doctorId or date" }, { status: 400 });

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor || doctor.userId !== userId) return NextResponse.json({ message: "Invalid doctor" }, { status: 400 });

    const created = await prisma.appointment.create({
      data: { userId, doctorId, date: new Date(date), reason, notes },
      include: { doctor: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Appointments POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}