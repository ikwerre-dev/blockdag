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

    const ins = await prisma.insurance.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(ins);
  } catch (error) {
    console.error("Insurance GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { provider, policyNumber, coverage, phone } = body as { provider: string; policyNumber?: string; coverage?: string; phone?: string };
    if (!provider) return NextResponse.json({ message: "Missing provider" }, { status: 400 });

    const created = await prisma.insurance.create({ data: { userId, provider, policyNumber, coverage, phone } });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Insurance POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}