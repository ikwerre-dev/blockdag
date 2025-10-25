import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string };

    const card = await prisma.medicalCard.findUnique({ where: { userId: decoded.userId } });
    return NextResponse.json({ card });
  } catch (error) {
    console.error("Card GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string };
    const body = await request.json();
    const { color, text, visibleFields } = body as { color?: string; text?: string; visibleFields?: any };

    const card = await prisma.medicalCard.upsert({
      where: { userId: decoded.userId },
      update: {
        color: color ?? undefined,
        text: text ?? undefined,
        visibleFields: visibleFields ?? undefined,
      },
      create: {
        userId: decoded.userId,
        color: color || "#194dbe",
        text: text || "",
        visibleFields: visibleFields || {},
      },
    });

    return NextResponse.json({ card });
  } catch (error) {
    console.error("Card POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}