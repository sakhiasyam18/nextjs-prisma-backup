// app/api/mobile/pilgrim/documents/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Mengambil semua dokumen milik pengguna yang sedang login.
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
    const documents = await prisma.document.findMany({
      where: {
        userId: userId,
      },
      select: {
        idDocument: true,
        documentType: true,
        filePath: true, // Nanti di aplikasi mobile, ini bisa jadi link untuk download/view
        status: true,
      },
      orderBy: {
        documentType: "asc", // Urutkan berdasarkan tipe dokumen
      },
    });

    if (documents.length === 0) {
      return NextResponse.json(
        { message: "Anda belum memiliki dokumen yang diunggah." },
        { status: 404 }
      );
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error("GET_DOCUMENTS_ERROR", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dokumen." },
      { status: 500 }
    );
  }
}
