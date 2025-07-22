// File: middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key"
);

// Middleware ini SEKARANG HANYA BERJALAN di rute yang butuh proteksi
export async function middleware(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  // Karena matcher sudah diubah, kita tidak perlu lagi if/else untuk bypass login
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId as string);
    requestHeaders.set("x-user-email", payload.email as string);
    requestHeaders.set("x-user-role", payload.role as string);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Token tidak valid atau kedaluwarsa." },
      { status: 401 }
    );
  }
}

// =================================================================
// PERUBAHAN UTAMA DI SINI
// =================================================================
export const config = {
  /*
   * Cocokkan semua path API, KECUALI untuk path yang mengandung 'v1/auth'.
   * Ini secara efektif membuat rute login & register menjadi publik
   * dan middleware hanya akan melindungi rute-rute lainnya.
   */
  matcher: "/api/((?!v1/auth).*)",
};
