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
            "SELECT COUNT(*) AS count FROM users"
        ) as any[];

        const [totalTransactions] = await db.query(
            "SELECT COUNT(*) AS count FROM transactions"
        ) as any[];

        const [totalVolume] = await db.query(
            "SELECT SUM(amount) AS total FROM transactions WHERE status = 'paid'"
        ) as any[];

        return NextResponse.json({
            totalUsers: totalUsers.count,
            totalTransactions: totalTransactions.count,
            totalVolume: totalVolume.total || 0,
            activeUsers: activeUsers.count
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}