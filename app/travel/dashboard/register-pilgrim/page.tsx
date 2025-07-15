'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddJamaahPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        telephone: '',
        noPaspor: '',
        alamat: '',
        nik: '',
        golDarah: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        // Nanti bisa fetch POST ke backend
        alert('Data Jamaah berhasil disimpan.');
        router.push('/travel/dashboard'); // Balik ke dashboard
    };

    return (
        <div className="max-w-xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Form Input Data Jamaah</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Nama</label>
                    <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nama lengkap"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@example.com"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Telephone</label>
                    <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="08xxxxxxxxxx"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">No. Paspor</label>
                    <input
                        type="text"
                        name="noPaspor"
                        value={formData.noPaspor}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Axxxxxxx"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Alamat</label>
                    <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Alamat lengkap"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">NIK</label>
                    <input
                        type="text"
                        name="nik"
                        value={formData.nik}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="327xxxxxxxxx"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Golongan Darah</label>
                    <input
                        type="text"
                        name="golDarah"
                        value={formData.golDarah}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="A / B / AB / O"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Simpan Data Jamaah
                </button>
            </form>
        </div>
    );
}
