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
    const { provider, policyNumber, coverage, phone } = body as { provider?: string; policyNumber?: string; coverage?: string; phone?: string };

    const existing = await prisma.insurance.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const updated = await prisma.insurance.update({ where: { id }, data: { provider, policyNumber, coverage, phone } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Insurance PUT error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const existing = await prisma.insurance.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return NextResponse.json({ message: "Not found" }, { status: 404 });

    await prisma.insurance.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Insurance DELETE error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}