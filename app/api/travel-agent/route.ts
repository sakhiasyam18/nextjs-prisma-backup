// File: app/api/travel-agent/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan path ini sesuai dengan struktur proyek Anda

/**
 * @swagger
 * /api/travel-agent:
 * get:
 * summary: Mengambil semua data travel agent
 * description: Mengembalikan daftar semua travel agent yang ada di database.
 * tags: [Travel Agent]
 * responses:
 * 200:
 * description: Sukses mengambil data.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/TravelAgent'
 * 500:
 * description: Terjadi kesalahan pada server.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Ambil semua data travel agent dari database
    const travelAgents = await prisma.travelAgent.findMany();

    // 2. Kirim data sebagai respons
    return NextResponse.json(travelAgents, { status: 200 });
  } catch (error) {
    console.error("GET_TRAVEL_AGENTS_ERROR", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat mengambil data" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/travel-agent:
 * post:
 * summary: Membuat travel agent baru
 * description: Menambahkan travel agent baru ke dalam database.
 * tags: [Travel Agent]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * example: "Travel Juara"
 * address:
 * type: string
 * example: "Jl. Kemenangan No. 1, Jakarta"
 * phone:
 * type: string
 * example: "081234567890"
 * responses:
 * 201:
 * description: Travel agent berhasil dibuat.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/TravelAgent'
 * 400:
 * description: Data yang dikirim tidak valid.
 * 500:
 * description: Terjadi kesalahan pada server.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Ambil data dari body request
    const body = await request.json();
    const { name, address, phone } = body;

    // 2. Validasi input (pastikan 'name' ada)
    if (!name) {
      return NextResponse.json(
        { error: "Nama travel agent wajib diisi" },
        { status: 400 }
      );
    }

    // 3. Buat data travel agent baru di database
    const newTravelAgent = await prisma.travelAgent.create({
      data: {
        name,
        address,
        phone,
      },
    });

    // 4. Kirim data yang baru dibuat sebagai respons
    return NextResponse.json(newTravelAgent, { status: 201 });
  } catch (error) {
    console.error("CREATE_TRAVEL_AGENT_ERROR", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat membuat data" },
      { status: 500 }
    );
  }
}

// Tambahkan komponen schema untuk Swagger (opsional, tapi sangat membantu)
/**
 * @swagger
 * components:
 * schemas:
 * TravelAgent:
 * type: object
 * properties:
 * idTravelAgent:
 * type: string
 * format: uuid
 * description: ID unik untuk travel agent.
 * name:
 * type: string
 * description: Nama travel agent.
 * address:
 * type: string
 * description: Alamat travel agent.
 * phone:
 * type: string
 * description: Nomor telepon travel agent.
 */
