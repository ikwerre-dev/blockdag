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
    const { title, description, data, type, warningNotes } = body as {
      title?: string;
      description?: string;
      data?: string;
      type?: "ILLNESS" | "ALLERGY" | "MEDICATION" | "TEST_RESULT" | "PROCEDURE" | "IMMUNIZATION" | "NOTE" | "OTHER";
      warningNotes?: string;
    };

    const existing = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const updated = await prisma.medicalRecord.update({
      where: { id },
      data: { title, description, data, type, warningNotes },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Records PUT error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const existing = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await prisma.medicalRecord.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Records DELETE error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}