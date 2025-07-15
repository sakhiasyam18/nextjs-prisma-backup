// File: app/login/page.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // <-- Impor library yang baru diinstall

// Definisikan bentuk data yang ada di dalam token
interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal untuk login");
      }

      const { token } = await res.json();
      localStorage.setItem("token", token); // Tetap simpan token

      // --- LOGIKA PENGARAHAN BERDASARKAN ROLE ---
      const decodedToken = jwtDecode<DecodedToken>(token); // Baca isi token
      const userRole = decodedToken.role;

if (userRole === 'PPIH') {
  router.push('/ppih/dashboard'); // Arahkan ke dashboard PPIH
} else if (userRole === 'Travel') {
  router.push('/travel/dashboard'); // Arahkan ke dashboard Travel
} else if (userRole === 'Pilgrim' || userRole === 'Mutawali') {
  setError("Role Anda untuk aplikasi mobile. Silakan login melalui aplikasi.");
  localStorage.removeItem('token');
} else {
  throw new Error("Role tidak dikenali. Akses ditolak.");
}
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-slate-800">
          Portal Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full cursor-pointer rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}