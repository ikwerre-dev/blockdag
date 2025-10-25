import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdminToken(request);
    
    // Await the params to ensure they're resolved
    const { id } = await params;
    
    const { action, amount } = await request.json();
    if (!action || !amount) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const operator = action === 'topup' ? '+' : '-';
    
    await db.query(
      `UPDATE wallets 
       SET balance = balance ${operator} ?
       WHERE id = ?`,
      [amount, id]
    );

    return NextResponse.json({ message: "Wallet updated successfully" });
  } catch (error) {
    console.error("Error updating wallet:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}