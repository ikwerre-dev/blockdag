import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket } from "mysql2"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transactionId = params.id

    if (!transactionId) {
      return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 })
    }

    // Verify the user is authenticated
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: number; email: string }

    // Fetch transaction details
    const transactions = (await db.query(
      `SELECT 
        t.id, 
        t.sender_id, 
        t.recipient_id, 
        t.sender, 
        t.recipient, 
        t.amount, 
        t.currency, 
        t.status, 
        t.type, 
        t.transaction_hash, 
        t.description, 
        t.meta_data,
        t.created_at,
        t.updated_at,
        CASE 
          WHEN t.sender_id = ? THEN 'sent' 
          WHEN t.recipient_id = ? THEN 'received' 
          ELSE 'unknown' 
        END as transaction_type,
        0 as fee
      FROM transactions t
      WHERE t.id = ? AND (t.sender_id = ? OR t.recipient_id = ?)`,
      [decoded.userId, decoded.userId, transactionId, decoded.userId, decoded.userId],
    )) as RowDataPacket[]

    if (transactions.length === 0) {
      return NextResponse.json({ message: "Transaction not found or unauthorized" }, { status: 404 })
    }

    const transaction = transactions[0]

    // Parse meta_data if it exists
    if (transaction.meta_data) {
      try {
        transaction.meta_data = JSON.parse(transaction.meta_data)
      } catch (e) {
        console.error("Error parsing meta_data:", e)
      }
    }

    // Format the transaction data for the frontend
    const formattedTransaction = {
      id: transaction.id,
      transactionHash: transaction.transaction_hash,
      type: transaction.transaction_type,
      amount: Number.parseFloat(transaction.amount),
      currency: transaction.currency,
      sender: transaction.sender,
      recipient: transaction.recipient,
      date: transaction.created_at,
      hash: transaction.transaction_hash,
      status: transaction.status,
      reference: transaction.transaction_hash.substring(0, 8).toUpperCase(),
      fee: Number.parseFloat(transaction.fee || 0),
      description: transaction.description,
      metaData: transaction.meta_data,
      updatedAt: transaction.updated_at,
    }

    return NextResponse.json({ transaction: formattedTransaction })
  } catch (error) {
    console.error("Transaction fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
