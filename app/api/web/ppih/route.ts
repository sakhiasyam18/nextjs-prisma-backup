// app/api/web/ppih/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Middleware sudah memastikan hanya role PPIH yang bisa sampai ke sini.
  return NextResponse.json({ message: "Selamat datang di Dashboard khusus PPIH." });
}