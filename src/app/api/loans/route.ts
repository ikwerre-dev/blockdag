import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";


type LoanRequest = {
    id: number;
    user_id: number;
    amount: number;
    reason: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: number; email: string };
 
        const loans = await db.query(
            "SELECT * FROM loan_requests WHERE user_id = ? ORDER BY created_at DESC",
            [decoded.userId]
        ) as (RowDataPacket)[];

        console.log(loans)

      

        return NextResponse.json(loans);
    } catch (error) {
        console.error("Error fetching loans:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}