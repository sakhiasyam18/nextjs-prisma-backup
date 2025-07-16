// app/travel/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Anda bisa membuat tipe data User di file terpisah agar bisa di-impor
interface User {
  id: string;
  email: string;
  role: string;
}

export default function TravelDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Logika untuk verifikasi token tetap sama
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/v1/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("Sesi tidak valid");
        return res.json();
      })
      .then((userData) => {
        // Jika yang login bukan Travel, tendang!
        if (userData.role !== "Travel") {
          router.push("/forbidden"); // <-- Arahkan ke halaman 'forbidden'
        } else {
          setUser(userData);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) {
    return <p>Loading Dashboard Travel...</p>;
  }

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-full rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard Travel
          </h1>
          <p className="mt-1 text-slate-500">
            Selamat datang kembali, {user.email}!
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm"
        >
          Logout
        </button>
      </div>

      {/* Panel Utama */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          Panel Khusus Agen Travel
        </h2>
        <p className="mt-1 text-slate-600">
          Ini adalah konten yang hanya bisa dilihat oleh Agen Travel.
        </p>
        <a
          href="/travel/list-jamaah" // Link diperbaiki sesuai struktur folder
          className="mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Lihat Daftar Jamaah
        </a>
      </div>
    </div>
  );
}
