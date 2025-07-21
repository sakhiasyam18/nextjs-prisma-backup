// app/api/mobile/pilgrim/profile/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // Middleware akan memastikan pengguna terotentikasi
  // dan menyisipkan ID pengguna di header.
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { error: "User tidak terotentikasi" },
      { status: 401 }
    );
  }

  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        idUser: userId,
      },
      select: {
        idUser: true,
        fullName: true,
        email: true,
        phone: true,
        role: {
          select: {
            name: true,
          },
        },
        travelAgent: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "Profil tidak ditemukan" },
        { status: 404 }
      );
    }

    // Mengembalikan data profil dalam format JSON
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("GET_PILGRIM_PROFILE_ERROR", error);
    return NextResponse.json(
      { error: "Gagal mengambil data profil." },
      { status: 500 }
    );
  }
}
