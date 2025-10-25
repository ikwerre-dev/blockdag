import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    let query = `
      SELECT 
        t.id, t.amount, t.currency, t.status, t.type,t.transaction_hash, t.created_at,
        CONCAT(u1.first_name, ' ', u1.last_name) AS sender,
        CONCAT(u2.first_name, ' ', u2.last_name) AS recipient
      FROM transactions t
      LEFT JOIN users u1 ON t.sender_id = u1.id
      LEFT JOIN users u2 ON t.recipient_id = u2.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += " AND t.status = ?";
      params.push(status);
    }

    if (type) {
      query += " AND t.type = ?";
      params.push(type);
    }

    if (search) {
      query += " AND (u1.email LIKE ? OR u2.email LIKE ? OR t.transaction_hash LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += " ORDER BY t.created_at DESC";

    const transactions = await db.query(query, params);

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}