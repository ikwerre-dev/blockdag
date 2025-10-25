import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const [user] = await db.query(
      "SELECT * FROM users WHERE email = ? AND is_admin = 1",
      [email]
    ) as any[];

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: true },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );


    const cookieStore = await cookies();
    cookieStore.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: (60 * 60 * 24) * 30,
        path: "/",
    });


    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}