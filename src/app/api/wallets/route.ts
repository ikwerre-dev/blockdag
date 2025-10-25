import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

        return NextResponse.json({ wallets: [], message: "Wallets are not used in the medical dashboard" });
    } catch (error) {
        console.error("Wallet fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

        return NextResponse.json({ message: "Wallet creation is disabled for the medical dashboard" }, { status: 200 });
    } catch (error) {
        console.error("Wallet creation error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}