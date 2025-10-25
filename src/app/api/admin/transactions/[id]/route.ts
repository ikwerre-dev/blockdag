import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";

interface UpdateBody {
  status: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminToken(request);

    const body: UpdateBody = await request.json();
    const { status } = body;

    if (!["pending", "paid", "unpaid"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update transaction status
    await db.query(
      `UPDATE transactions SET status = ? WHERE id = ?`,
      [status, params.id]
    );

    return NextResponse.json({ message: "Transaction status updated" });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}