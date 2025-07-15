// File: app/api/auth/me/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Ambil data user yang sudah di-decode dan dititipkan oleh middleware
  const userId = request.headers.get('x-user-id');
  const userEmail = request.headers.get('x-user-email');
  const userRole = request.headers.get('x-user-role');

  if (!userId) {
    return NextResponse.json({ error: 'User tidak terotentikasi' }, { status: 401 });
  }

  // Kirim kembali data user ke frontend
  return NextResponse.json({
    id: userId,
    email: userEmail,
    role: userRole,
  });
}