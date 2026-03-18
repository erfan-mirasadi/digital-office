import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const SECRET = new TextEncoder().encode("diszcovery-super-secret-key-2026");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (email === "admin@diszcovery.com" && password === "admin123") {
      const token = await new SignJWT({ email, role: "developer" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(SECRET);

      const response = NextResponse.json({ success: true }, { status: 200 });
      response.cookies.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 2,
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
