// app/api/web/users/route.ts

import { NextResponse, type NextRequest } from 'next/server'; // REVISI: Tambahkan NextRequest
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: { role: { name: 'Pilgrim' } },
      include: { role: true },
    });

    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPass } = user;
      return userWithoutPass;
    });

    return NextResponse.json(usersWithoutPassword);
    
  } catch (error) {
    console.error("GET_USERS_ERROR", error);
    return NextResponse.json({ error: "Gagal mengambil data pengguna." }, { status: 500 });
  }
}