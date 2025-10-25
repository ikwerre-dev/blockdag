import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdminToken(request);
    
    const [user] = await db.query(
      `SELECT 
        u.id, u.email, u.first_name, u.p2p_code, u.phone, u.last_name, u.is_verified, u.created_at
      FROM users u
      WHERE u.id = ?`,
      [params.id]
    ) as any[];

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const wallets = await db.query(
      `SELECT  
        id, user_id, currency, balance
      FROM wallets
      WHERE user_id = ?`,
      [params.id]
    ) as any[];

    return NextResponse.json({ 
      ...user,
      wallets: Array.isArray(wallets) ? wallets : []
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdminToken(request);
    
    await db.query(
      "DELETE FROM users WHERE id = ?",
      [params.id]
    );

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}