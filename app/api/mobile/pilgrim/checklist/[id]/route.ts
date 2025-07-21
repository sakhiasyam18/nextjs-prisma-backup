// app/api/mobile/pilgrim/checklist/[id]/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * Mengubah status item checklist (misalnya, mencentang atau batal centang).
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const userId = request.headers.get("x-user-id");
  const checklistItemId = params.id;

  if (!userId) {
    return NextResponse.json(
      { error: "User tidak terotentikasi" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { isCompleted } = body;

    // Pastikan isCompleted adalah boolean
    if (typeof isCompleted !== "boolean") {
      return NextResponse.json(
        { error: "Status `isCompleted` harus boolean" },
        { status: 400 }
      );
    }

    // Pastikan item checklist ini milik user yang sedang login sebelum diupdate
    const itemToUpdate = await prisma.checklist.findFirst({
      where: {
        idChecklist: checklistItemId,
        userId: userId,
      },
    });

    if (!itemToUpdate) {
      return NextResponse.json(
        { error: "Item checklist tidak ditemukan atau Anda tidak punya akses" },
        { status: 404 }
      );
    }

    const updatedItem = await prisma.checklist.update({
      where: {
        idChecklist: checklistItemId,
      },
      data: {
        isCompleted: isCompleted,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("UPDATE_CHECKLIST_ITEM_ERROR", error);
    return NextResponse.json(
      { error: "Gagal mengubah item checklist." },
      { status: 500 }
    );
  }
}

/**
 * Menghapus sebuah item dari checklist.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const userId = request.headers.get("x-user-id");
  const checklistItemId = params.id;

  if (!userId) {
    return NextResponse.json(
      { error: "User tidak terotentikasi" },
      { status: 401 }
    );
  }

  try {
    // Pastikan item checklist ini milik user yang sedang login sebelum dihapus
    const itemToDelete = await prisma.checklist.findFirst({
      where: {
        idChecklist: checklistItemId,
        userId: userId,
      },
    });

    if (!itemToDelete) {
      return NextResponse.json(
        { error: "Item checklist tidak ditemukan atau Anda tidak punya akses" },
        { status: 404 }
      );
    }

    await prisma.checklist.delete({
      where: {
        idChecklist: checklistItemId,
      },
    });

    return NextResponse.json(
      { message: "Item berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE_CHECKLIST_ITEM_ERROR", error);
    return NextResponse.json(
      { error: "Gagal menghapus item checklist." },
      { status: 500 }
    );
  }
}
