// D:\mabruxxxx\mabruxfix\components\Sidebar.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
// Impor ikon dari react-icons
import {
  FiGrid,
  FiUsers,
  FiUserPlus,
  FiCompass,
  FiLogOut,
} from "react-icons/fi";

// --- Tipe Data untuk Menu ---
interface MenuItem {
  id: string;
  text: string;
  // Mengubah tipe 'icon' menjadi komponen React
  icon: React.ElementType;
  link: string;
}

// --- Data Menu dengan Ikon yang Sesuai ---
const menuData: MenuItem[] = [
  {
    id: "dashboard",
    text: "Dashboard",
    icon: FiGrid, // Ikon untuk Dashboard
    link: "/travel/dashboard",
  },
  {
    id: "list-jamaah",
    text: "Daftar Jamaah",
    icon: FiUsers, // Ikon untuk Daftar Jamaah
    link: "/travel/list-jamaah",
  },
  {
    id: "register-jamaah",
    text: "Registrasi Jamaah",
    icon: FiUserPlus, // Ikon untuk Registrasi
    link: "/travel/register-jamaah",
  },
];

export default function ClientSide() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 text-slate-300 p-4 flex flex-col border-r border-slate-800 shadow-2xl">
      {/* Header Sidebar: Logo Aplikasi */}
      <div className="flex items-center justify-center py-2 mb-6 border-b border-slate-800">
        <Image
          src="/logo.png"
          alt="Mabrurx Logo"
          width={100}
          height={100}
          priority
        />
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 space-y-2">
        <ul>
          {menuData.map((item) => {
            const isActive = pathname === item.link;
            return (
              <li key={item.id}>
                <Link
                  href={item.link}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600/20 text-white border-l-4 border-blue-500 font-semibold"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive
                        ? "text-blue-400"
                        : "text-slate-500 group-hover:text-white"
                    }`}
                  />
                  <span className="text-sm">{item.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Sidebar: User Profile & Logout */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
          <img
            src="https://placehold.co/40x40/1e293b/94a3b8?text=A"
            alt="User Avatar"
            className="h-10 w-10 rounded-full border-2 border-slate-700"
          />
          <div>
            <p className="text-sm font-semibold text-white">Admin Travel</p>
            <p className="text-xs text-slate-400">admin.travel@email.com</p>
          </div>
        </div>
        <button className="w-full mt-2 group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200">
          <FiLogOut className="h-5 w-5 text-slate-500 group-hover:text-red-400" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
