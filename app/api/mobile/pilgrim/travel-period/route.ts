// app/api/mobile/pilgrim/travel-period/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Mengambil data periode perjalanan untuk pengguna yang sedang login.
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
    // Pengguna biasanya hanya punya satu periode perjalanan aktif,
    // tapi findMany lebih aman jika ada data ganda.
    const travelPeriods = await prisma.travelPeriod.findMany({
      where: {
        userId: userId,
      },
      select: {
        idTravelPeriod: true,
        packageName: true,
        startDate: true,
        endDate: true,
      },
    });

    if (travelPeriods.length === 0) {
      return NextResponse.json(
        { message: "Informasi periode perjalanan tidak ditemukan." },
        { status: 404 }
      );
    }

    // Biasanya hanya ada satu, jadi kita kembalikan objek pertama jika ada,
    // atau seluruh array jika ternyata ada lebih dari satu.
    const responseData =
      travelPeriods.length === 1 ? travelPeriods[0] : travelPeriods;

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("GET_TRAVEL_PERIOD_ERROR", error);
    return NextResponse.json(
      { error: "Gagal mengambil data periode perjalanan." },
      { status: 500 }
    );
  }
}
