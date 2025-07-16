"use client";

import React, { useState, useEffect } from "react";

// Definisikan tipe data untuk Jamaah sesuai dengan data dari API
interface Jamaah {
  idUser: string;
  fullName: string;
  email: string;
  phone: string | null;
  // Tambahkan properti lain jika ada, misalnya alamat dari tabel lain
  // alamat: string | null;
}

export default function ListJamaahPage() {
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Handle jika tidak ada token, misalnya redirect ke login
      // router.push('/login');
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
          setJamaahList([]); // Kosongkan list jika gagal
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

  const selectedJamaah = jamaahList.find((j) => j.idUser === openDetailId);

  return (
    <div className="p-6 text-gray-800 relative">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Daftar Jamaah</h1>

      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : (
        <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left px-6 py-3">No</th>
              <th className="text-left px-6 py-3">Nama</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {jamaahList.length > 0 ? (
              jamaahList.map((jamaah, index) => (
                <tr key={jamaah.idUser} className="border-b hover:bg-blue-50">
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{jamaah.fullName}</td>
                  <td className="px-6 py-3">{jamaah.email}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => setOpenDetailId(jamaah.idUser)}
                      className="text-blue-600 hover:underline"
                    >
                      Lihat
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500">
                  Belum ada data jamaah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal Popup */}
      {selectedJamaah && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black bg-opacity-30"
          onClick={() => setOpenDetailId(null)} // tutup modal kalau klik overlay
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()} // supaya klik di dalam modal tidak menutup modal
          >
            <h2 className="text-xl font-semibold mb-4">
              {selectedJamaah.fullName}
            </h2>
            <p>
              <strong>Email:</strong> {selectedJamaah.email}
            </p>
            <p>
              <strong>Telepon:</strong>{" "}
              {selectedJamaah.phone || "Tidak tersedia"}
            </p>
            {/* Untuk alamat, Anda perlu memastikan data ini ada di payload user
              atau melakukan fetch tambahan berdasarkan ID user jika diperlukan.
              Contoh: <p><strong>Alamat:</strong> {selectedJamaah.alamat || 'Tidak tersedia'}</p>
            */}
            <button
              onClick={() => setOpenDetailId(null)}
              className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
