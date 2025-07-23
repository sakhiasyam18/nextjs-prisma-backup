// File: middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken"; // <-- GANTI DARI 'jose' KE 'jsonwebtoken'

// Secret key sekarang hanya string biasa, agar cocok dengan di file login
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

// Definisikan tipe data untuk payload yang sudah di-decode
interface DecodedPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE SECRET:", process.env.JWT_SECRET); // <-- Tambahkan ini
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    // =================================================================
    // CARA MEMVERIFIKASI TOKEN SEKARANG MENGGUNAKAN 'jsonwebtoken'
    // =================================================================
    const payload = jwt.verify(token, JWT_SECRET) as DecodedPayload;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-email", payload.email);
    requestHeaders.set("x-user-role", payload.role);

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

export const config = {
  /*
   * Matcher ini sudah benar, tidak perlu diubah.
   * Middleware akan berjalan di semua rute /api/ KECUALI /api/v1/auth/...
   */
  matcher: "/api/((?!v1/auth).*)",
};
