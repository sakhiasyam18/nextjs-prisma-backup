// app/travel/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut, FiArrowRight } from "react-icons/fi";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function TravelDashboardPage() {
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
        if (userData.role !== "Travel") {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 rounded-2xl bg-slate-800/50 p-6 backdrop-blur-lg border border-slate-700 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Travel</h1>
          <p className="mt-1">Selamat datang kembali, {user.email}!</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-sm w-full md:w-auto"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
      {/* Panel Utama */}
      <div className="rounded-2xl bg-slate-800/50 p-8 backdrop-blur-lg border border-slate-700 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-slate-600">
        <h2 className="text-2xl font-bold text-white">
          Panel Khusus Agen Travel
        </h2>
        <p className="mt-2max-w-xl">
          Ini adalah pusat kendali Anda. Kelola semua data jamaah, dokumen, dan
          jadwal perjalanan dari panel ini.
        </p>
        <a
          href="/travel/list-jamaah"
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
        >
          <span>Lihat Daftar Jamaah</span>
          <FiArrowRight />
        </a>
      </div>
    </div>
  );
}
