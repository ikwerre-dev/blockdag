import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as {
      userId: number;
      email: string;
      isAdmin: boolean;
    };

    if (!decoded.isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    // Verify admin exists in database
    const [admin] = await db.query(
      "SELECT id FROM users WHERE id = ? AND is_admin = 1",
      [decoded.userId]
    ) as any[];

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Authenticated" });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}