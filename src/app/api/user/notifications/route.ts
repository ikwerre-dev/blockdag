import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function PUT(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your-secret-key"
        ) as { userId: string; address: string };

        // Guard if notification delegate is unavailable
        if (!(prisma as any).notification?.updateMany || !(prisma as any).notification?.findMany) {
            console.warn("Prisma notification delegate unavailable; no-op update");
            return NextResponse.json({ notifications: [], message: "No notifications to update" });
        }

        await prisma.notification.updateMany({
            where: { userId: decoded.userId },
            data: { isRead: true },
        });

        const notifications = await prisma.notification.findMany({
            where: { userId: decoded.userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            notifications,
            message: "Notifications updated successfully"
        });
    } catch (error) {
        console.error("Notification update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}