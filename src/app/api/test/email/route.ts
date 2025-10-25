import { NextRequest, NextResponse } from "next/server";
 
export async function POST(request: NextRequest) {
  try {
    const { type, email, firstName } = await request.json();
    
    if (!type || !email || !firstName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    if (type === "welcome") {
       return NextResponse.json({ message: "Welcome email sent successfully" });
    } 
    else if (type === "login") {
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 '127.0.0.1';
      const userAgent = request.headers.get('user-agent') || 'Unknown';
      
      
      return NextResponse.json({ message: "Login notification email sent successfully" });
    }
    else {
      return NextResponse.json(
        { message: "Invalid email type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json(
      { message: "Failed to send test email", error: (error as Error).message },
      { status: 500 }
    );
  }
}