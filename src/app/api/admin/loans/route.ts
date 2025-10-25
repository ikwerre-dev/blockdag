import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const loans = (await db.query(
      "SELECT * FROM loan_requests ORDER BY created_at DESC"
    )) as RowDataPacket[];

    return NextResponse.json({ loans });
  } catch (error) {
    console.error("Error fetching loans:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update loan status
    await db.query(
      "UPDATE loan_requests SET status = ? WHERE id = ?",
      [status, id]
    );

    // Get user ID from loan
    const [loan] = (await db.query(
      "SELECT user_id FROM loan_requests WHERE id = ?",
      [id]
    )) as RowDataPacket[];

    // If approved, add to wallet
    if (status === "approved") {
      const [loanDetails] = (await db.query(
        "SELECT amount FROM loan_requests WHERE id = ?",
        [id]
      )) as RowDataPacket[];

      await db.query(
        "UPDATE wallets SET balance = balance + ? WHERE user_id = ?",
        [loanDetails.amount, loan.user_id]
      );
    }

    // Create notification
    await db.query(
      "INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)",
      [
        loan.user_id,
        "loan",
        "Loan Status Update",
        `Your loan request status has been updated to ${status}`,
      ]
    );

    return NextResponse.json({ message: "Loan status updated successfully" });
  } catch (error) {
    console.error("Error updating loan status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}