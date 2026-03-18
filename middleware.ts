import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("diszcovery-super-secret-key-2026");

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token) {
    try {
      await jwtVerify(token, SECRET);
      if (isLoginPage) {
        return NextResponse.redirect(new URL("/workspace", request.url));
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/workspace"],
};
