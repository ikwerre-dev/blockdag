import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        await verifyAdminToken(request);

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const limit = searchParams.get("limit");

        // Get users
        const users = await db.query(
            `SELECT 
        u.id, u.email, u.first_name,u.p2p_code,u.phone, u.last_name, u.is_verified, u.created_at
      FROM users u
      WHERE (u.email LIKE ? OR u.first_name LIKE ? OR u.p2p_code LIKE ? OR u.phone LIKE ? OR u.last_name LIKE ?)
      AND u.id != 1
      ORDER BY u.created_at DESC
      ${limit ? `LIMIT ${parseInt(limit)}` : ''}`,
            [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
        ) as any[];

        // Get wallets for users
        const userIds = users.map(user => user.id);
        let wallets = [];

        if (userIds.length > 0) {
            const placeholders = userIds.map(() => '?').join(',');

            wallets = await db.query(
                `SELECT 
         id, user_id, currency, balance
        FROM wallets
        WHERE user_id IN (${placeholders})`,
                userIds
            ) as any[];
        }

        // Combine data
        const usersWithWallets = users.map(user => ({
            ...user,
            wallets: wallets.filter(wallet => wallet.user_id === user.id)
        }));

        return NextResponse.json({ users: usersWithWallets });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}