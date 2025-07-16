// app/page.tsx
import Link from "next/link";
import { FiNavigation } from "react-icons/fi"; // Menggunakan ikon yang lebih relevan

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 p-4 font-sans">
      {/* --- Inovasi: Latar Belakang Dinamis & Efek Cahaya --- */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute -bottom-1/2 left-0 -z-10 h-1/2 w-full animate-pulse bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/50 via-slate-900 to-slate-900 opacity-50 blur-3xl"></div>
      <div className="absolute -top-1/4 right-0 -z-10 h-1/2 w-1/2 animate-pulse bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/50 via-slate-900 to-slate-900 opacity-50 blur-3xl"></div>

      {/* --- Kartu Konten Utama --- */}
      <div className="w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-8 text-center shadow-2xl shadow-blue-500/10 backdrop-blur-lg sm:p-12">
          {/* Ikon Header */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 shadow-lg shadow-blue-500/50">
            <FiNavigation className="h-10 w-10 text-white" />
          </div>

          {/* Judul */}
          <h1 className="mt-8 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-4xl font-extrabold text-transparent">
            Selamat Datang
          </h1>
          <p className="mt-2 text-slate-400">
            Portal manajemen Mabrux untuk membantu kebutuhan anda.
          </p>

          {/* Tombol Aksi (Call to Action) */}
          <Link
            href="/login"
            className="mt-10 inline-block w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/50 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/50 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Masuk ke Portal
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Mabrux App. All Rights Reserved.
      </footer>
    </main>
  );
}
