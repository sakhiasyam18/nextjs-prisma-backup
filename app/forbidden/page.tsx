// app/forbidden/page.tsx
import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="space-y-4 rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-red-600">
          403 - Akses Ditolak
        </h1>
        <p className="text-slate-600">
          Maaf, Anda tidak memiliki hak untuk mengakses halaman ini.
        </p>
        <Link href="/login" className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Kembali ke Halaman Login
        </Link>
      </div>
    </main>
  );
}