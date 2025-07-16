// app/ppih/components/sidebarClient.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

// --- Menu Data Interface and Data ---
interface MenuItem {
  id: string;
  text: string;
  link: string;
}

// Menu khusus untuk PPIH
const menuData: MenuItem[] = [
  {
    id: "dashboard",
    text: "Dashboard",
    link: "/ppih/dashboard",
  },
  {
    id: "list-travel",
    text: "List Travel",
    link: "/ppih/list-travel",
  },
];

export default function ClientSide() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-green-800 text-gray-100 p-5 min-h-screen shadow-lg flex flex-col transition-all duration-300 ease-in-out">
      {/* Header Sidebar */}
      <div className="flex items-center mb-8 px-2 py-2">
        <span className="text-2xl font-extrabold text-white">PPIH</span>
        <span className="text-lg font-light ml-1 text-gray-300">Portal</span>
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
                  className={`group flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out
                    ${isActive
                      ? 'bg-green-600 text-white shadow-md transform scale-105'
                      : 'hover:bg-green-700 hover:text-white'}
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