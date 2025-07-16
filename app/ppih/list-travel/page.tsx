// File: app/ppih/list-travel/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Definisikan tipe data
interface TravelAgent {
  idTravelAgent: string;
  name: string;
  address: string | null;
  phone: string | null;
}

const ListTravelPage = () => {
  // 1. Gunakan useState untuk menyimpan data agent
  const [travelAgents, setTravelAgents] = useState<TravelAgent[]>([]);

  // 2. Gunakan useEffect untuk mengambil data saat komponen dimuat di browser
  useEffect(() => {
    // Fungsi untuk mengambil data dari API
    const getTravelAgents = async () => {
      try {
        const token = localStorage.getItem("token"); // Gantilah 'token' dengan key yang sesuai

        // Karena ini Client Component, 'window.location.origin' aman digunakan
        const res = await fetch(`${window.location.origin}/api/travel-agent`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Gagal mengambil data, status: ${res.status}`);
        }

        const data = await res.json();
        setTravelAgents(data); // Simpan data ke state
      } catch (error) {
        console.error("FETCH_ERROR:", error);
        // Jika error, data tetap array kosong
        setTravelAgents([]);
      }
    };

    getTravelAgents();
  }, []); // Array kosong [] berarti useEffect hanya berjalan sekali

  // 3. Render JSX
  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Daftar Agen Travel
            </h1>
            <p className="mt-2 text-gray-600">
              Berikut adalah daftar semua agen travel yang terdaftar di sistem.
            </p>
          </div>
          <Link href="/ppih/list-travel/create">
            <span className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Tambah Baru
            </span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Nama Agen
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Alamat
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  No. Telepon
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {travelAgents.length > 0 ? (
                travelAgents.map((agent) => (
                  <tr
                    key={agent.idTravelAgent}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium">{agent.name}</td>
                    <td className="py-3 px-4">{agent.address || "N/A"}</td>
                    <td className="py-3 px-4">{agent.phone || "N/A"}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/ppih/list-travel/edit/${agent.idTravelAgent}`}
                      >
                        <span className="text-blue-600 hover:underline">
                          Lihat
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">
                    Belum ada data agen travel yang terdaftar atau gagal memuat
                    data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListTravelPage;
