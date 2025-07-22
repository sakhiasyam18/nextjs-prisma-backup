// File: app/api/v1/auth/login/route.ts

import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.role) {
      return NextResponse.json(
        { status: "error", message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // 2. Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { status: "error", message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // 3. Buat JSON Web Token (JWT)
    const token = jwt.sign(
      {
        userId: user.idUser,
        email: user.email,
        role: user.role.name,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Hapus password dari objek user sebelum dikirim sebagai respons
    const { password: _, ...userWithoutPassword } = user;

    // 5. Buat struktur respons baru yang lebih kaya
    const responseData = {
      status: "success",
      message: "Login berhasil!",
      user: {
        idUser: userWithoutPassword.idUser,
        fullName: userWithoutPassword.fullName,
        email: userWithoutPassword.email,
        phone: userWithoutPassword.phone,
        role: userWithoutPassword.role.name,
      },
      accessToken: token,
    };

    // 6. Kirim data yang baru ke client
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
