// app/api/mobile/pilgrim/schedules/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Mengambil semua jadwal kegiatan untuk pengguna yang sedang login.
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
    const schedules = await prisma.schedule.findMany({
      where: {
        userId: userId,
      },
      // Urutkan jadwal berdasarkan waktu mulai, dari yang paling awal
      orderBy: {
        startTime: "asc",
      },
    });

    if (schedules.length === 0) {
      return NextResponse.json(
        { message: "Belum ada jadwal yang diatur untuk Anda." },
        { status: 404 }
      );
    }

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("GET_SCHEDULES_ERROR", error);
    return NextResponse.json(
      { error: "Gagal mengambil data jadwal." },
      { status: 500 }
    );
  }
}
