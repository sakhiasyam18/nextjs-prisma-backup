// app/api/mobile/pilgrim/ritual-progress/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { error: "User tidak terotentikasi" },
      { status: 401 }
    );
  }

  try {
    const ritualProgress = await prisma.statusProgress.findMany({
      where: {
        userId: userId,
      },
      // Sertakan data dari tabel RitualSection agar lebih informatif
      include: {
        ritualSection: {
          select: {
            name: true,
            description: true,
            sequenceOrder: true,
          },
        },
      },
      // Urutkan berdasarkan urutan ritual
      orderBy: {
        ritualSection: {
          sequenceOrder: "asc",
        },
      },
    });

    if (!ritualProgress) {
      return NextResponse.json(
        { message: "Belum ada data kemajuan ritual untuk Anda." },
        { status: 404 }
      );
    }

    return NextResponse.json(ritualProgress);
  } catch (error) {
    console.error("GET_RITUAL_PROGRESS_ERROR", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kemajuan ritual." },
      { status: 500 }
    );
  }
}
