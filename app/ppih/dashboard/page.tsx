// app/ppih/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function PpihDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/v1/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('Sesi tidak valid');
        return res.json();
      })
      .then(userData => {
if (userData.role !== 'PPIH') {
    router.push('/forbidden'); // <-- Arahkan ke halaman 'forbidden'
} else {
            setUser(userData);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!user) {
    return <p>Loading Dashboard PPIH...</p>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard PPIH</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
      <p className="mt-2">Selamat datang, {user.email}!</p>
      <div className="mt-6 p-4 border border-green-500 rounded bg-green-50">
        <h2 className="font-bold">Panel Khusus PPIH</h2>
        <p>Ini adalah konten yang hanya bisa dilihat oleh PPIH.</p>
      </div>
    </div>
  );
}