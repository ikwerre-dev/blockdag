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

    const doctors = await prisma.doctor.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Doctors GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, specialty, phone } = body as { name: string; specialty?: string; phone?: string };
    if (!name) return NextResponse.json({ message: "Missing name" }, { status: 400 });

    const created = await prisma.doctor.create({ data: { userId, name, specialty, phone } });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Doctors POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}