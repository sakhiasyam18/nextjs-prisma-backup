// app/ppih/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function PpihDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Mulai dengan status loading true
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/v1/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Sesi tidak valid");
        }
        return res.json();
      })
      .then((userData) => {
        if (userData.role !== "PPIH") {
          router.push("/forbidden");
        } else {
          setUser(userData);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => {
        setLoading(false); // Hentikan loading setelah selesai
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Tampilkan loading sampai verifikasi selesai
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-slate-500 animate-pulse">Memverifikasi sesi...</p>
      </div>
    );
  }

  // Jika tidak loading dan user tidak ada, jangan render apa-apa (akan diredirect)
  if (!user) {
    return null;
  }

  // Tampilan utama dasbor
  return (
    <div className="space-y-8">
      {/* Header Dasbor */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Dashboard PPIH</h1>
          <p className="mt-1 text-slate-400">
            Selamat datang, Petugas {user.email}!
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-sm"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </header>
      {/* Panel Utama Konten */}
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:shadow-emerald-500/10 hover:border-slate-600">
        <h2 className="text-2xl font-bold text-white">Panel Khusus PPIH</h2>
        <p className="mt-2 text-slate-400 max-w-xl">
          Ini adalah konten yang hanya bisa dilihat oleh PPIH.
        </p>
      </div>
    </div>
  );
}
