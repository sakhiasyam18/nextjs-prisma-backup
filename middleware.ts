// File: middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati middleware untuk route login dan register
  if (
    pathname.startsWith("/api/v1/auth/login") ||
    pathname.startsWith("/api/v1/auth/register")
  ) {
    return NextResponse.next();
  }

  // Hanya periksa apakah header Authorization ada, tanpa verifikasi
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Lanjutkan request. Verifikasi token akan dilakukan di masing-masing API route.
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
