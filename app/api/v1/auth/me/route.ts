// File: app/api/v1/auth/me/route.ts
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

// Definisikan tipe payload lagi di sini
interface DecodedPayload {
  userId: string;
  email: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Ambil token dari header
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "User tidak terotentikasi" },
        { status: 401 }
      );
    }

    // 2. Verifikasi token menggunakan jsonwebtoken (ini akan berhasil karena di Node.js runtime)
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedPayload;

    // 3. Kirim kembali data user ke frontend
    return NextResponse.json({
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (error) {
    // Jika token tidak valid (kadaluwarsa, dll)
    return NextResponse.json(
      { error: "Token tidak valid atau kedaluwarsa." },
      { status: 401 }
    );
  }
}
