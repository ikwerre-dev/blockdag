import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAdminToken(request);
    const { currency, amount, action } = await request.json();

    // Check if user exists
    const [user] = await db.query("SELECT id FROM users WHERE id = ?", [params.id]) as any[];
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get or create wallet
    const [wallet] = await db.query(
      "SELECT id, balance FROM wallets WHERE user_id = ? AND currency = ?",
      [params.id, currency]
    ) as any[];

    if (!wallet) {
      // Create new wallet
      await db.query(
        "INSERT INTO wallets (user_id, currency, balance) VALUES (?, ?, ?)",
        [params.id, currency, action === "add" ? amount : 0]
      );
    } else {
      // Update existing wallet
      const newBalance = action === "add" 
        ? wallet.balance + amount 
        : Math.max(0, wallet.balance - amount);
      
      await db.query(
        "UPDATE wallets SET balance = ? WHERE id = ?",
        [newBalance, wallet.id]
      );
    }

    // Create transaction record
    await db.query(
      `INSERT INTO transactions 
       (sender_id, recipient_id, amount, currency, status, type, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        action === "add" ? null : params.id,
        action === "add" ? params.id : null,
        amount,
        currency,
        "paid",
        "admin_adjustment",
        `Admin ${action === "add" ? "added" : "removed"} funds`
      ]
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