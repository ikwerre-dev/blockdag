import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const [totalUsers] = await db.query(
      "SELECT COUNT(*) AS count FROM users"
    ) as any[];

    const [activeUsers] = await db.query(
      "SELECT COUNT(DISTINCT user_id) AS count FROM sessions WHERE last_activity > NOW() - INTERVAL 30 MINUTE"
    ) as any[];

    const [totalTransactions] = await db.query(
      "SELECT COUNT(*) AS count FROM transactions"
    ) as any[];

    const [totalVolume] = await db.query(
      "SELECT SUM(amount) AS total FROM transactions WHERE status = 'paid'"
    ) as any[];

    const recentTransactions = await db.query(
      `SELECT 
        t.id, t.amount, t.currency, t.created_at,
        CONCAT(u1.first_name, ' ', u1.last_name) AS sender,
        CONCAT(u2.first_name, ' ', u2.last_name) AS recipient
      FROM transactions t
      LEFT JOIN users u1 ON t.sender_id = u1.id
      LEFT JOIN users u2 ON t.recipient_id = u2.id
      ORDER BY t.created_at DESC
      LIMIT 5`
    ) as any[];

    return NextResponse.json({
      totalUsers: totalUsers.count,
      activeUsers: activeUsers.count,
      totalTransactions: totalTransactions.count,
      totalVolume: totalVolume.total || 0,
      recentTransactions
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}