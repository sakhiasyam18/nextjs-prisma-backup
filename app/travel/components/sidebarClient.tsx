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
    id: "home",
    text: "Home",
    icon: "DashboardIcon", // Menggunakan ikon yang sudah ada
    link: "/travel/dashboard", // Mengubah link ke dashboard utama
    roles: ["public"], // Terlihat untuk semua orang
  },
  {
    id: "our-division",
    text: "Our Division",
    icon: "UsersIcon", // Menggunakan ikon yang sudah ada
    link: "#", // Mengubah link kosong menjadi # karena submenu tidak diimplementasikan
    roles: ["public"],
  },
  {
    id: "company-profile",
    text: "Company Profile",
    icon: "ProfileIcon", // Menggunakan ikon yang sudah ada
    link: "#", // Mengubah link kosong menjadi #
    roles: ["public"],
  },
  {
    id: "join-us",
    text: "Join Us",
    icon: "ProfileIcon", // Menggunakan ikon yang sudah ada
    link: "/travel/joinus", // Mengubah link kosong menjadi #
    roles: ["public"],
  },
  {
    id: "blog-news",
    text: "Blog & News",
    icon: "NewsIcon", // Menggunakan ikon yang sudah ada
    link: "news/latest",
    roles: ["public"],
  },
  {
    id: "gallery",
    text: "Gallery",
    icon: "ImageIcon", // Menggunakan ikon yang sudah ada
    link: "/travel/gallery",
    roles: ["public"],
  },
  {
    id: "contact-us",
    text: "Contact Us",
    icon: "PhoneIcon", // Menggunakan ikon yang sudah ada
    link: "contact-us",
    roles: ["public"],
  },
  {
    id: "language-switcher", // ID untuk menu "globe" (pemilih bahasa)
    text: "Language", // Teks untuk ikon globe
    icon: "GlobeIcon", // Menggunakan ikon globe yang sudah ada
    link: "#", // Biasanya pemilih bahasa tidak mengarah ke link baru, tapi membuka modal/dropdown
    roles: ["public"],
  },
  {
    id: "admin-dashboard", // ID untuk menu "user" (admin dashboard)
    text: "Admin Dashboard", // Teks untuk ikon user
    icon: "UserIcon", // Menggunakan ikon user yang sudah ada
    link: "admin/dashboard",
    roles: ["Admin"], // Mengasumsikan ada peran 'Admin' baru untuk ini
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