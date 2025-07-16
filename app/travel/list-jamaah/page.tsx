//E:\nextjs-prisma-backup\app\travel\list-jamaah\page.tsx
// app/travel/list-jamaah/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiSearch, FiPlus, FiX } from "react-icons/fi";
import Link from "next/link";

// Definisikan tipe data untuk Jamaah
interface Jamaah {
  idUser: string;
  fullName: string;
  email: string;
  phone: string | null;
}

export default function ListJamaahPage() {
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchJamaah = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/web/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setJamaahList(data);
        } else {
          console.error("Gagal mengambil data jamaah dari server.");
          setJamaahList([]);
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data jamaah:", error);
        setJamaahList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJamaah();
  }, []);

  // Logika untuk filter pencarian (client-side)
  const filteredJamaah = jamaahList.filter(
    (jamaah) =>
      jamaah.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jamaah.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedJamaah = jamaahList.find((j) => j.idUser === openDetailId);

  return (
    <div className="bg-slate-900 text-white min-h-full p-4 sm:p-6 lg:p-8 rounded-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Daftar Jamaah</h1>
          <p className="mt-1 text-slate-400">
            Manajemen data jamaah yang terdaftar.
          </p>
        </div>
        <Link
          href="/travel/register-jamaah"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/50 w-full sm:w-auto"
        >
          <FiPlus />
          <span>Tambah Jamaah</span>
        </Link>
      </div>

      {/* Kontrol dan Search Bar */}
      <div className="relative mb-6">
        <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama atau email jamaah..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 pl-12 text-white placeholder-slate-400 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Tabel Data */}
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {loading ? (
          <p className="text-center text-slate-400 p-10">
            Memuat data jamaah...
          </p>
        ) : (
          <table className="min-w-full">
            <thead className="border-b border-slate-700">
              <tr>
                <th
                  scope="col"
                  className="text-left p-4 font-semibold text-slate-300"
                >
                  Nama
                </th>
                <th
                  scope="col"
                  className="text-left p-4 font-semibold text-slate-300 hidden md:table-cell"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="text-left p-4 font-semibold text-slate-300 hidden lg:table-cell"
                >
                  Telepon
                </th>
                <th scope="col" className="relative p-4">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredJamaah.length > 0 ? (
                filteredJamaah.map((jamaah) => (
                  <tr
                    key={jamaah.idUser}
                    className="hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center">
                          <FiUser className="text-slate-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {jamaah.fullName}
                          </div>
                          <div className="text-slate-400 md:hidden">
                            {jamaah.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-300 hidden md:table-cell">
                      {jamaah.email}
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-300 hidden lg:table-cell">
                      {jamaah.phone || "N/A"}
                    </td>
                    <td className="p-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setOpenDetailId(jamaah.idUser)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-500">
                    Tidak ada data jamaah yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Detail */}
      {selectedJamaah && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpenDetailId(null)}
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          ></div>
          <div
            className="relative w-full max-w-lg rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl p-8 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedJamaah.fullName}
                </h2>
                <p className="text-slate-400 mt-1">Detail Informasi Jamaah</p>
              </div>
              <button
                onClick={() => setOpenDetailId(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="mt-6 border-t border-slate-700 pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <FiMail className="text-slate-400" />
                <span className="text-slate-300">{selectedJamaah.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-slate-400" />
                <span className="text-slate-300">
                  {selectedJamaah.phone || "Tidak tersedia"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}