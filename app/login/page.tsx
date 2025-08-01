// File: app/login/page.tsx
"use client";
import Image from "next/image";
import { useState, useEffect, FormEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

// --- Komponen baru khusus untuk partikel ---
const ParticleBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Kode ini hanya berjalan di client, jadi Math.random() aman digunakan
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Jangan render apapun di server untuk menghindari hydration error
    return null;
  }

  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDuration: `${Math.random() * 20 + 20}s`,
            animationDelay: `-${Math.random() * 40}s`,
          }}
        />
      ))}
    </>
  );
};

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
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal untuk login");
      }

      const { accessToken } = data;
      localStorage.setItem("token", accessToken);

      const decodedToken = jwtDecode<DecodedToken>(accessToken);
      const userRole = decodedToken.role;

      if (userRole === "PPIH") {
        router.push("/ppih/dashboard");
      } else if (userRole === "Travel") {
        router.push("/travel/dashboard");
      } else if (userRole === "Pilgrim" || userRole === "Mutawali") {
        setError(
          "Role Anda untuk aplikasi mobile. Silakan login melalui aplikasi."
        );
        localStorage.removeItem("token");
      } else {
        throw new Error("Role tidak dikenali. Akses ditolak.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const { currentTarget: target } = e;
      const rect = (target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (target as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (target as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    };

    const mainElement = document.getElementById("login-main");
    if (mainElement) {
      mainElement.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <>
      {/* --- CSS untuk Animasi dan Efek (Inovasi) --- */}
      <style jsx>{`
        #login-main::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(29, 78, 216, 0.15),
            transparent 40%
          );
          z-index: 0;
          pointer-events: none;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .form-container {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes particle-move {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-100vh);
          }
        }
        .particle {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: particle-move linear infinite;
        }
      `}</style>

      <main
        id="login-main"
        className="relative flex min-h-screen items-center justify-center bg-slate-900 p-4 overflow-hidden"
      >
        {/* Panggil komponen partikel di sini */}
        <ParticleBackground />

        <div className="form-container w-full max-w-md space-y-8 rounded-2xl bg-slate-800/50 p-8 shadow-2xl backdrop-blur-lg border border-slate-700 z-10">
          {/* Header */}
          <div className="text-center">
            <Image
              src="/logo.png"
              alt="Mabrurx Logo"
              width={120}
              height={120}
              className="mx-auto mb-4"
              priority
            />
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Portal Login
            </h1>
            <p className="mt-2 text-slate-400">
              Masuk untuk melanjutkan ke dashboard Anda.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Alamat Email"
                className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 p-3 pl-12 text-white placeholder-slate-400 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 p-3 pl-12 text-white placeholder-slate-400 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {error && (
              <p className="text-center text-sm text-red-400 animate-pulse">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/40 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
