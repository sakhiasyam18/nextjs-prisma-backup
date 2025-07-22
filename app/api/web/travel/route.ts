// app/api/web/travel/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Ambil data user dari header yang sudah di-decode oleh middleware
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    // Validasi sederhana
    if (!userId || !userRole) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pastikan hanya role "Travel" yang bisa akses
    if (userRole !== "Travel") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { idUser: userId },
      select: {
        fullName: true,
        travelAgentId: true, // Ambil travelAgentId
      },
    });

    if (!user || !user.travelAgentId) {
      return NextResponse.json(
        { error: "User atau data travel agent tidak ditemukan" },
        { status: 404 }
      );
    }

    const travelAgent = await prisma.travelAgent.findUnique({
      where: { idTravelAgent: user.travelAgentId },
      select: { idTravelAgent: true, name: true },
    });

    if (!travelAgent) {
      return NextResponse.json(
        { error: "Detail travel agent tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Berhasil ambil data travel agent",
      id_user: userId,
      user_name: user.fullName,
      travel_agent_id: travelAgent.idTravelAgent,
      travel_agent_name: travelAgent.name,
    });
  } catch (error) {
    console.error("ERROR_TRAVEL_ROUTE:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
