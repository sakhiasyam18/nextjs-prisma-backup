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
    <div className="p-8 text-gray-800">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Travel</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
      <p className="mt-2">Selamat datang, {user.email}!</p>
      <div className="mt-6 p-4 border border-blue-500 rounded bg-blue-50">
        <h2 className="font-bold">Panel Khusus Agen Travel</h2>
        <p>Ini adalah konten yang hanya bisa dilihat oleh Agen Travel.</p>
        <a href="/dashboard/users" className="text-blue-600 hover:underline mt-4 inline-block">
          Lihat Daftar Jemaah
        </a>
      </div>
    </div>
  );
}
