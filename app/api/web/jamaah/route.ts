import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validasi
    if (!data.fullName || !data.email || !data.phone || !data.travelAgentId) {
      return NextResponse.json(
        { error: "Field wajib belum lengkap" },
        { status: 400 }
      );
    }

    const saved = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        travelAgent: {
          connect: { idTravelAgent: data.travelAgentId },
        },
        password: await bcrypt.hash(data.password, 10), // hash password
        role: {
          connect: { name: "Pilgrim" },
        },
      },
    });

    return NextResponse.json({
      message: "Data jamaah berhasil disimpan",
      saved,
    });
  } catch (error) {
    console.error("ERROR_SAVE_JAMAAH:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data jamaah" },
      { status: 500 }
    );
  }
}
