// app/api/web/travel/route.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export async function GET(request: NextRequest) {
//   // Middleware sudah memastikan hanya role Travel yang bisa sampai ke sini.
//   return NextResponse.json({ message: "Ini adalah data rahasia milik Agen Travel." });
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized: Missing or invalid Authorization header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log("Token extracted:", token);

    let payload: { userId: string; role: string; full_name: string };
    try {
      payload = jwt.verify(token, JWT_SECRET) as typeof payload;
      console.log("Decoded JWT payload:", payload);
    } catch (e) {
      console.log("Token verification failed:", e);
      return NextResponse.json({ error: "Token invalid" }, { status: 401 });
    }

    if (!["Travel", "Admin Travel Agency"].includes(payload.role)) {
      console.log("Access denied: Role not allowed:", payload.role);
      return NextResponse.json({ error: "Akses ditolak, bukan admin travel" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { idUser: payload.userId },
    });
    console.log("User fetched from DB:", user);

    if (!user) {
      console.log("User tidak ditemukan di DB dengan id:", payload.userId);
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const travelAgent = await prisma.travelAgent.findFirst({
      where: { idTravelAgent: user.travelAgentId! },
      select: { idTravelAgent: true, name: true },
    });
    console.log("Travel agent fetched from DB:", travelAgent);

    if (!travelAgent) {
      console.log("Travel agent tidak ditemukan dengan nama:", user.fullName);
      return NextResponse.json({ error: "Travel agent tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Berhasil ambil data travel agent",
      id_user: payload.userId,
      user_name: user.fullName,
      travel_agent_id: travelAgent.idTravelAgent,
      travel_agent_name: travelAgent.name,
    });
  } catch (error) {
    console.error("ERROR_TRAVEL_ROUTE:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
