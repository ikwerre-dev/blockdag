import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your-secret-key"
        ) as { userId: string; address: string; handle?: string };

        // Fetch user profile
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Fetch medical records
        const records = await prisma.medicalRecord.findMany({
            where: { userId: decoded.userId },
            orderBy: { createdAt: "desc" },
        });

        // Fetch notifications (guard if delegate is unavailable)
        let notifications: any[] = [];
        if ((prisma as any).notification?.findMany) {
            notifications = await prisma.notification.findMany({
                where: { userId: decoded.userId },
                orderBy: { createdAt: "desc" },
            });
        } else {
            console.warn("Prisma notification delegate unavailable; returning empty notifications");
        }

        return NextResponse.json({
            user,
            records,
            notifications,
        });
    } catch (error) {
        console.error("Data fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}