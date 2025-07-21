// app/api/mobile/pilgrim/assets/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Mengambil semua aset/barang milik pengguna yang sedang login.
 */
export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { error: "User tidak terotentikasi" },
      { status: 401 }
    );
  }

  try {
    const assets = await prisma.jamaahAsset.findMany({
      where: {
        userId: userId,
      },
      select: {
        idJamaahAsset: true,
        name: true,
        description: true,
        status: true,
        verifiedAt: true,
        // Sertakan nama petugas yang memverifikasi jika ada
        verifiedBy: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        name: "asc", // Urutkan berdasarkan nama aset
      },
    });

    if (assets.length === 0) {
      return NextResponse.json(
        { message: "Anda belum memiliki data aset." },
        { status: 404 }
      );
    }

    return NextResponse.json(assets);
  } catch (error) {
    console.error("GET_JEMAAH_ASSETS_ERROR", error);
    return NextResponse.json(
      { error: "Gagal mengambil data aset." },
      { status: 500 }
    );
  }
}
