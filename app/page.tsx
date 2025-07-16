// app/page.tsx
import Link from 'next/link';
// import { ShieldCheckIcon } from '@heroicons/react/24/outline'; // Contoh penggunaan ikon

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-4 font-sans">
      {/* Background Gradient & Shapes */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 top-0 -z-10 h-1/3 w-2/3 bg-gradient-to-br from-blue-100 via-blue-50 to-white opacity-60 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 -z-10 h-1/3 w-2/3 bg-gradient-to-tl from-green-100 via-green-50 to-white opacity-50 blur-3xl"></div>

      {/* Main Content Card */}
      <div className="w-full max-w-md transform transition-all duration-300 hover:scale-[1.02]">
        <div className="rounded-xl border border-gray-200/80 bg-white/70 p-8 text-center shadow-xl backdrop-blur-lg sm:p-12">
          
          {/* Header Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-500 shadow-lg">
            {/* Menggunakan inisial atau logo sederhana */}
            <span className="text-3xl font-bold text-white">MA</span>
          </div>

          {/* Heading */}
          <h1 className="mt-8 bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-4xl font-extrabold text-transparent">
            Selamat Datang
          </h1>
          <p className="mt-2 text-slate-600">
            Portal manajemen Mabrux untuk membantu kebutuhan anda.
          </p>

          {/* Call to Action Button */}
          <Link 
            href="/login" 
            className="mt-10 inline-block w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Masuk ke Portal
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Mabrux App. All Rights Reserved.
      </footer>
    </main>
  );
}