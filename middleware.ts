// File: middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.headers.get('authorization')?.split(' ')[1];

  // Bypass API login/register karena tidak perlu token
  if (pathname.startsWith('/api/v1/auth/login') || pathname.startsWith('/api/v1/auth/register')) {
    return NextResponse.next();
  }

  // Jika rute API lain diakses tanpa token, tolak.
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId as string);
    requestHeaders.set('x-user-email', payload.email as string);
    requestHeaders.set('x-user-role', payload.role as string);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });

  } catch (error) {
    return NextResponse.json({ error: "Token tidak valid atau kedaluwarsa." }, { status: 401 });
  }
}

export const config = {
  // REVISI PENTING: Jaga HANYA semua rute di bawah /api/
  matcher: '/api/:path*',
};