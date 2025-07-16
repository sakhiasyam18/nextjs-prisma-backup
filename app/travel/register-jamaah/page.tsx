"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function AddJamaahPage() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telephone: "",
    noPaspor: "",
    alamat: "",
    nik: "",
    golDarah: "",
    password: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [idTravelAgent, setIdTravelAgent] = useState<string | null>(null);
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/web/travel", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.travel_agent_id) {
          setIdTravelAgent(data.travel_agent_id);
        }
      })
      .catch(() => {
        // error handling optional
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotif(null);

    if (!idTravelAgent) {
      setNotif({ message: "Travel Agent belum tersedia, coba refresh halaman.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/web/jamaah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.nama,
          email: formData.email,
          phone: formData.telephone,
          travelAgentId: idTravelAgent,
          password: "password123",
          roleId: "204cfb31-707a-4f7d-9941-9f627bcfcd21",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setNotif({ message: "Data Jamaah berhasil disimpan!", type: "success" });
        setFormData({
          nama: "",
          email: "",
          telephone: "",
          noPaspor: "",
          alamat: "",
          nik: "",
          golDarah: "",
          password: "",
        });
        setSelectedFile(null);
      } else {
        setNotif({ message: `❌ Gagal simpan: ${result.error || "Terjadi kesalahan"}`, type: "error" });
      }
    } catch {
      setNotif({ message: "❌ Terjadi kesalahan saat menyimpan data.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadExcel = async () => {
    if (!selectedFile) {
      alert("Pilih file Excel dulu!");
      return;
    }
    if (!idTravelAgent) {
      alert("Travel Agent belum tersedia, coba refresh halaman.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const formattedData = jsonData
        .filter((item) => item["Nama"] && item["Email"] && item["Telephone"])
        .map((item) => ({
          fullName: item["Nama"],
          email: item["Email"],
          phone: String(item["Telephone"]),
          travelAgentId: idTravelAgent,
          password: "password123", // <-- PENTING, agar backend tidak error
        }));

      setLoading(true);
      let successCount = 0;
      let failedCount = 0;

      const token = localStorage.getItem("token");

      for (const data of formattedData) {
        try {
          const response = await fetch("/api/web/jamaah", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            successCount++;
          } else {
            failedCount++;
          }
        } catch {
          failedCount++;
        }
      }

      setNotif({ message: `${successCount} data berhasil diimport.`, type: "success" });
      setLoading(false);
    };

    reader.readAsBinaryString(selectedFile);
  };

  return (
    <div className="p-6 min-h-screen flex bg-gray-50">
      {/* Formulir Section */}
      <div className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Formulir Data Jamaah</h1>

        {notif && (
          <div className={`mb-6 px-4 py-3 rounded ${notif.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`} role="alert">
            {notif.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Nama" name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama lengkap" />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" type="email" />
          <InputField label="Password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" />
          <InputField label="Telephone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="08xxxxxxxxxx" type="tel" />
          <InputField label="No. Paspor" name="noPaspor" value={formData.noPaspor} onChange={handleChange} placeholder="Axxxxxxx" />
          <TextAreaField label="Alamat" name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Alamat lengkap" />
          <InputField label="NIK" name="nik" value={formData.nik} onChange={handleChange} placeholder="327xxxxxxxxx" />
          <InputField label="Golongan Darah" name="golDarah" value={formData.golDarah} onChange={handleChange} placeholder="A / B / AB / O" />
          <button type="submit" disabled={loading} className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}>
            {loading ? "Menyimpan..." : "Simpan Data Jamaah"}
          </button>
        </form>
      </div>

      {/* Import Excel Section */}
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">Import Data Jamaah (Excel)</h2>

        <a href="/template/template-mabrurX.xlsx" download className="block w-full text-center bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-3 rounded-xl transition mb-4">
          Download Template Excel
        </a>

        <input
          type="file"
          accept=".xlsx"
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={handleFileChange}
        />
        {selectedFile && <p className="mt-4 text-center text-gray-800 text-sm">📄 {selectedFile.name}</p>}
        <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition" onClick={handleUploadExcel} disabled={loading}>
          {loading ? "Mengupload..." : "Upload Excel"}
        </button>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder, type = "text" }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-gray-800 mb-2">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={placeholder} />
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, placeholder }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-gray-800 mb-2">{label}</label>
      <textarea name={name} value={value} onChange={onChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={placeholder} rows={3}></textarea>
    </div>
  );
}
