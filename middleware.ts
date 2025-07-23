// File: middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Gunakan jose yang sudah terinstall

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati middleware untuk route login dan register
  if (
    pathname.startsWith("/api/v1/auth/login") ||
    pathname.startsWith("/api/v1/auth/register")
  ) {
    return NextResponse.next();
  }

  // Hanya periksa rute API yang memerlukan otentikasi
  if (pathname.startsWith("/api/")) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verifikasi token di sini
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // Buat header baru untuk meneruskan data user
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.userId as string);
      requestHeaders.set("x-user-role", payload.role as string);
      requestHeaders.set("x-user-email", payload.email as string);

      // Lanjutkan request dengan header yang sudah dimodifikasi
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
