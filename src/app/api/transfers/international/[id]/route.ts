import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket } from "mysql2"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    console.log(id)

    const [rows] = await db.query(
      `SELECT * FROM transactions WHERE transaction_hash = ?`,
      [id]
    ) as RowDataPacket[]

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 })
    }

    const transaction = rows

    return NextResponse.json(transaction)

  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json(
      { message: "Failed to fetch transaction details" },
      { status: 500 }
    )
  }
}