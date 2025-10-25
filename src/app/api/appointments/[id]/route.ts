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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const body = await request.json();
    const { doctorId, date, reason, notes } = body as { doctorId?: string; date?: string; reason?: string; notes?: string };

    const existing = await prisma.appointment.findUnique({ where: { id }, include: { doctor: true } });
    if (!existing || existing.userId !== userId) return NextResponse.json({ message: "Not found" }, { status: 404 });

    if (doctorId) {
      const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
      if (!doctor || doctor.userId !== userId) return NextResponse.json({ message: "Invalid doctor" }, { status: 400 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { doctorId, date: date ? new Date(date) : undefined, reason, notes },
      include: { doctor: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Appointments PUT error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return NextResponse.json({ message: "Not found" }, { status: 404 });

    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Appointments DELETE error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}