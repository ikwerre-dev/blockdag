import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket } from "mysql2"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    // Get the P2P code from the URL parameters
    const p2pCode = params.code

    if (!p2pCode) {
      return NextResponse.json({ message: "P2P code is required" }, { status: 400 })
    }

    // Verify the user is authenticated
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: number; email: string }

    // Find user by P2P code
    const users = (await db.query("SELECT id, first_name, last_name, email, p2p_code FROM users WHERE p2p_code = ?", [
      p2pCode,
    ])) as RowDataPacket[]

    if (users.length === 0) {
      return NextResponse.json({ message: "User with this P2P code not found" }, { status: 404 })
    }

    // Don't allow sending to yourself
    if (users[0].id === decoded.userId) {
      return NextResponse.json({ message: "You cannot send money to yourself" }, { status: 400 })
    }

    // Return the user data
    return NextResponse.json({
      user: {
        id: users[0].id,
        name: `${users[0].first_name} ${users[0].last_name}`, 
        email: users[0].email,
        p2p_code: users[0].p2p_code,
      },
    })
  } catch (error) {
    console.error("P2P validation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
