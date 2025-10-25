import { NextRequest, NextResponse } from "next/server";
 
export async function GET(request: NextRequest) {
    try {

       return NextResponse.json(
            { message: "Successful" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
