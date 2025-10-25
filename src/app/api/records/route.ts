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

    const records = await prisma.medicalRecord.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Records GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, description, data, type, warningNotes } = body as {
      title: string;
      description?: string;
      data: string;
      type?: "ILLNESS" | "ALLERGY" | "MEDICATION" | "TEST_RESULT" | "PROCEDURE" | "IMMUNIZATION" | "NOTE" | "OTHER";
      warningNotes?: string;
    };

    if (!title || !data) {
      return NextResponse.json({ message: "Missing required fields: title, data" }, { status: 400 });
    }

    const created = await prisma.medicalRecord.create({
      data: {
        userId,
        title,
        description,
        data,
        type: type || "ILLNESS",
        warningNotes,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Records POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}