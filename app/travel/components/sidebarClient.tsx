// D:\mabruxxxx\mabruxfix\components\Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

// --- Menu Data Interface and Data ---
interface MenuItem {
  id: string;
  text: string;
  icon: string; // Nama komponen ikon (menggunakan ikon yang sudah ada di Sidebar.tsx)
  link: string;
  roles: string[]; // Peran pengguna yang diizinkan melihat menu ini
}


const menuData: MenuItem[] = [
  {
    id: "Dashboard",
    text: "Dashboard",
    icon: "DashboardIcon", // Menggunakan ikon yang sudah ada
    link: "/travel/dashboard", // Mengubah link ke dashboard utama
    roles: ["public"], // Terlihat untuk semua orang
  },
  {
    id: "list-jamaah",
    text: "list-jamaah",
    icon: "UsersIcon", // Menggunakan ikon yang sudah ada
    link: "/travel/list-jamaah", // Mengubah link kosong menjadi # karena submenu tidak diimplementasikan
    roles: ["public"],
  },
  {
    id: "register-jamaah",
    text: "Register Jamaah",
    icon: "ProfileIcon", // Menggunakan ikon yang sudah ada
    link: "/travel/register-jamaah", // Mengubah link kosong menjadi #
    roles: ["public"],
  },
];

interface SidebarProps {
  userRole: string | null;
  children: ReactNode;
}


export default function ClientSide() {
  const pathname = usePathname();

//   const filteredMenu = menuData.filter(item =>
//     item.roles.includes("public") || (userRole && item.roles.includes(userRole))
//   );

  return (
    <div className="w-64 bg-red-900 text-gray-100 p-5 min-h-screen shadow-lg flex flex-col transition-all duration-300 ease-in-out">
      {/* Header Sidebar: Logo/Nama Aplikasi */}
      <div className="flex items-center mb-8 px-2 py-2">
        {/* Anda bisa menambahkan logo di sini */}
        <span className="text-2xl font-extrabold text-blue-400">test</span>
        <span className="text-lg font-light ml-1 text-gray-400">App</span>
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 space-y-2"> {/* space-y-2 untuk jarak antar menu group */}
        <ul>
          {menuData.map((item) => {
            const isActive = pathname === item.link;

            return (
              <li key={item.id}>
                <Link
                  href={item.link}
                  className={`group flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out
                    ${isActive
                      ? 'bg-blue-700 text-white shadow-md transform scale-105' // Lebih menonjol saat aktif
                      : 'hover:bg-gray-700 hover:text-white'}
                  `}
                >
                  <span className="ml-3 text-sm font-medium">{item.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Sidebar (Opsional) */}
      <div className="mt-auto pt-6 border-t border-gray-700 text-xs text-gray-500 text-center">
        &copy; 2025 Mabrux App.
      </div>
    </div>
  );
}