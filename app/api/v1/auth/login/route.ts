// File: app/api/v1/auth/login/route.ts

import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Update the import path to the correct relative path
import prisma from "../../../../../lib/prisma"; // Adjust the path as necessary

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
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // 2. Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
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

    // 4. Kirim token ke client
    return NextResponse.json({ token });

  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}