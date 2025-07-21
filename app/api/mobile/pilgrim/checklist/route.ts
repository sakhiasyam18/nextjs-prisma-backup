// app/api/mobile/pilgrim/checklist/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Mengambil semua item checklist untuk pengguna yang sedang login.
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
    const checklists = await prisma.checklist.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        itemName: "asc", // Urutkan berdasarkan nama item
      },
    });

    return NextResponse.json(checklists);
  } catch (error) {
    console.error("GET_CHECKLIST_ERROR", error);
    return NextResponse.json(
      { error: "Gagal mengambil data checklist." },
      { status: 500 }
    );
  }
}

/**
 * Menambahkan item baru ke checklist pengguna yang sedang login.
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
    const { itemName, description } = body;

    if (!itemName) {
      return NextResponse.json(
        { error: "Nama item tidak boleh kosong" },
        { status: 400 }
      );
    }

    const newChecklistItem = await prisma.checklist.create({
      data: {
        itemName: itemName,
        description: description,
        isCompleted: false, // Item baru default-nya belum dicentang
        userId: userId,
      },
    });

    return NextResponse.json(newChecklistItem, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("CREATE_CHECKLIST_ITEM_ERROR", error);
    return NextResponse.json(
      { error: "Gagal menambahkan item checklist." },
      { status: 500 }
    );
  }
}
