import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
 
// Import the User interface
interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    verification_token: string;
    reset_token: string;
    reset_token_expires: Date;
    last_login: Date;
}

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const users = await db.query("SELECT * FROM users WHERE email = ?", [email]) as (User & RowDataPacket)[];

        if (users.length === 0) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1d" }
        );

        const cookieStore = await cookies();
        cookieStore.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: (60 * 60 * 24) * 30,
            path: "/",
        });

        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'Unknown';
        const userAgent = request.headers.get('user-agent') || 'Unknown';

        const loginTime = new Date();
        await db.query(
            "UPDATE users SET last_login = ? WHERE id = ?",
            [loginTime, user.id]
        );
 
        const { password: _, ...userWithoutPassword } = user;

        // Create login notification (SQL)
        try {
            await db.query(
                "INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)",
                [user.id, "auth", "Login Successful", "You signed in with email/password."]
            );
        } catch (e) {
            console.warn("Failed to create SQL login notification:", e);
        }

        return NextResponse.json({
            message: "Login successful",
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
