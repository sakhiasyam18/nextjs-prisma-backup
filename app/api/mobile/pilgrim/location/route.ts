// app/api/mobile/pilgrim/location/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Menerima dan menyimpan data lokasi GPS dari pengguna.
 */
export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { error: "User tidak terotentikasi" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    // Validasi sederhana untuk memastikan data koordinat ada dan valid
    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Data latitude dan longitude diperlukan" },
        { status: 400 }
      );
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json(
        { error: "Latitude dan longitude harus dalam format angka" },
        { status: 400 }
      );
    }

    // Buat entri baru di tabel GpsLocation
    const newLocation = await prisma.gpsLocation.create({
      data: {
        latitude: latitude,
        longitude: longitude,
        userId: userId,
        // Timestamp akan otomatis dibuat oleh database
      },
    });

    return NextResponse.json(
      { message: "Lokasi berhasil disimpan", data: newLocation },
      { status: 201 }
    );
  } catch (error) {
    console.error("SAVE_GPS_LOCATION_ERROR", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data lokasi." },
      { status: 500 }
    );
  }
}
