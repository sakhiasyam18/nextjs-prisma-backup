// File: app/api/mobile/pilgrim/checklist/upload/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

/**
 * Menerima unggahan file checklist ibadah haji,
 * menyimpannya ke storage, dan mencatatnya ke database.
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
    const formData = await request.formData();
    const file = formData.get("checklistFile") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File checklist tidak ditemukan dalam request." },
        { status: 400 }
      );
    }

    // 1. Simpan file ke storage (misalnya folder 'public/uploads/checklists')
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file yang unik untuk menghindari konflik
    const filename = `${Date.now()}-${userId}-${file.name}`;
    const filePath = path.join(
      process.cwd(),
      "public/uploads/checklists",
      filename
    );

    // Tulis file ke sistem
    await writeFile(filePath, buffer);
    console.log(`File checklist diupload ke: ${filePath}`);

    // 2. Simpan informasi ke database menggunakan model 'Document'
    // Model 'Document' digunakan karena memiliki field 'filePath'
    const newDocument = await prisma.document.create({
      data: {
        userId: userId,
        documentType: "Checklist Ibadah Haji",
        filePath: `/uploads/checklists/${filename}`, // Path relatif untuk akses via web
        status: "Diverifikasi", // Langsung set status Diverifikasi
      },
    });

    // 3. Kirim respons sukses
    return NextResponse.json(
      {
        message: "Checklist ibadah haji dan sudah di upload",
        data: newDocument,
      },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("UPLOAD_CHECKLIST_ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file checklist." },
      { status: 500 }
    );
  }
}
