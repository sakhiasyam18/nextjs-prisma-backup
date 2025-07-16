"use client";
import { useState } from "react";

export default function AddJamaahPage() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telephone: "",
    noPaspor: "",
    alamat: "",
    nik: "",
    golDarah: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert("Data Jamaah berhasil disimpan:\n\n" + JSON.stringify(formData, null, 2));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      alert(`File ${file.name} berhasil dipilih. (Belum diproses, ya!)`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-12 p-6">
      <div className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Formulir Data Jamaah</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Nama" name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama lengkap" />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" type="email" />
          <InputField label="Telephone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="08xxxxxxxxxx" type="tel" />
          <InputField label="No. Paspor" name="noPaspor" value={formData.noPaspor} onChange={handleChange} placeholder="Axxxxxxx" />
          <TextAreaField label="Alamat" name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Alamat lengkap" />
          <InputField label="NIK" name="nik" value={formData.nik} onChange={handleChange} placeholder="327xxxxxxxxx" />
          <InputField label="Golongan Darah" name="golDarah" value={formData.golDarah} onChange={handleChange} placeholder="A / B / AB / O" />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition">
            Simpan Data Jamaah
          </button>
        </form>
      </div>

      <div className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">Import Data Jamaah (Excel)</h2>

        <a href="/template/template-mabrurX.xlsx" download className="block w-full text-center bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-3 rounded-xl transition mb-4">
          Download Template Excel
        </a>

        <input
          type="file"
          accept=".xlsx"
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={handleFileChange}
        />
        {selectedFile && <p className="mt-4 text-center text-gray-500 text-sm">📄 {selectedFile.name}</p>}
        <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition" onClick={() => alert(`File ${selectedFile?.name || "Belum ada file"} akan diproses (misalnya ke backend)`)}>
          Upload Excel
        </button>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder, type = "text" }: { label: string; name: string; value: string; onChange: any; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-gray-600 mb-2">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={placeholder} />
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, placeholder }: { label: string; name: string; value: string; onChange: any; placeholder?: string }) {
  return (
    <div>
      <label className="block text-gray-600 mb-2">{label}</label>
      <textarea name={name} value={value} onChange={onChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={placeholder} rows={3}></textarea>
    </div>
  );
}
