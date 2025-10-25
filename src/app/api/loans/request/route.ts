import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket } from "mysql2"
import jwt from "jsonwebtoken"
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: number; email: string }

    // Get request body
    const { amount, reason } = await request.json()

    if (!amount || !reason) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create loan request record
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ')
    await db.query(
      `INSERT INTO loan_requests 
       (user_id, amount, reason, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [decoded.userId, amount, reason, "pending", currentDate, currentDate]
    )

    // Create notification for user
    await db.query(
      "INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)",
      [
        decoded.userId,
        "loan",
        "Loan Request Submitted",
        `Your loan request for ${amount.toFixed(2)} is being reviewed.`
      ]
    )

    return NextResponse.json({
      message: "Loan request submitted successfully"
    })
  } catch (error) {
    console.error("Error creating loan request:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}