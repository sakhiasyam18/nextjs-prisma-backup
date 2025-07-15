// app/api/web/travel/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Middleware sudah memastikan hanya role Travel yang bisa sampai ke sini.
  return NextResponse.json({ message: "Ini adalah data rahasia milik Agen Travel." });
}