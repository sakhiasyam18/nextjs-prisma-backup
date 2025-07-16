"use client";

import React, { useState } from "react";

const dummyData = [
  {
    id: 1,
    nama: "Ahmad Fauzi",
    email: "ahmad@example.com",
    telephone: "08123456789",
    alamat: "Jl. Merpati No. 10, Jakarta",
  },
  {
    id: 2,
    nama: "Siti Nurhaliza",
    email: "siti@example.com",
    telephone: "08234567890",
    alamat: "Jl. Melati No. 5, Bandung",
  },
  {
    id: 3,
    nama: "Budi Santoso",
    email: "budi@example.com",
    telephone: "08345678901",
    alamat: "Jl. Kenanga No. 20, Surabaya",
  },
];

export default function ListJamaahPage() {
  const [openDetailId, setOpenDetailId] = useState<number | null>(null);

  const selectedJamaah = dummyData.find((j) => j.id === openDetailId);

  return (
    <div className="p-6 text-gray-800 relative">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Daftar Jamaah</h1>

      <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="text-left px-6 py-3">No</th>
            <th className="text-left px-6 py-3">Nama</th>
            <th className="text-left px-6 py-3">Detail</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((jamaah, index) => (
            <tr key={jamaah.id} className="border-b hover:bg-blue-50">
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3">{jamaah.nama}</td>
              <td className="px-6 py-3">
                <button onClick={() => setOpenDetailId(jamaah.id)} className="text-blue-600 hover:underline">
                  Lihat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Popup */}
      {selectedJamaah && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-transparent"
          onClick={() => setOpenDetailId(null)} // tutup modal kalau klik overlay
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()} // supaya klik di dalam modal tidak menutup modal
          >
            <h2 className="text-xl font-semibold mb-4">{selectedJamaah.nama}</h2>
            <p>
              <strong>Email:</strong> {selectedJamaah.email}
            </p>
            <p>
              <strong>Telepon:</strong> {selectedJamaah.telephone}
            </p>
            <p>
              <strong>Alamat:</strong> {selectedJamaah.alamat}
            </p>

            <button onClick={() => setOpenDetailId(null)} className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}