import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as {
    userId: number;
    email: string;
    isAdmin: boolean;
  };

  if (!decoded.isAdmin) {
    throw new Error("Admin access required");
  }

  // Verify admin exists in database
  const [admin] = await db.query(
    "SELECT id FROM users WHERE id = ? AND is_admin = 1",
    [decoded.userId]
  ) as any[];

  if (!admin) {
    throw new Error("Admin not found");
  }

  return decoded;
}