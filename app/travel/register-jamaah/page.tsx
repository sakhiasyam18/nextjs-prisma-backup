//app/travel/register-jamaah/page.tsx
"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import * as XLSX from "xlsx";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiFileText,
  FiMapPin,
  FiCreditCard,
  FiHeart,
  FiUploadCloud,
  FiDownload,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

// --- Helper Component: Input Field ---
function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ElementType;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-300 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
          className={`block w-full rounded-lg border border-slate-700 bg-slate-900/50 p-3 ${
            Icon ? "pl-12" : "px-4"
          } text-white placeholder-slate-500 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

// --- Helper Component: Text Area ---
function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-300 mb-2"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 p-3 px-4 text-white placeholder-slate-500 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        placeholder={placeholder}
        rows={3}
      ></textarea>
    </div>
  );
}

// --- Helper Component: Notification ---
function Notification({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  const isSuccess = type === "success";
  const baseClasses = "mb-6 flex items-center gap-4 rounded-lg border p-4";
  const successClasses = "bg-green-500/20 border-green-500/30 text-green-300";
  const errorClasses = "bg-red-500/20 border-red-500/30 text-red-300";
  const Icon = isSuccess ? FiCheckCircle : FiAlertTriangle;

  return (
    <div
      className={`${baseClasses} ${isSuccess ? successClasses : errorClasses}`}
    >
      <Icon className="h-6 w-6 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

// --- Main Page Component ---
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
  const [notif, setNotif] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Pastikan request ini mengirim header Authorization
    fetch("/api/web/travel", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }, // Baris ini sudah benar
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNotif(null);

    if (!idTravelAgent) {
      setNotif({
        message: "Sesi travel agent tidak ditemukan. Silakan refresh.",
        type: "error",
      });
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
        setNotif({
          message: "Data Jamaah berhasil disimpan!",
          type: "success",
        });
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
        setNotif({
          message: `Gagal menyimpan: ${result.error || "Terjadi kesalahan"}`,
          type: "error",
        });
      }
    } catch {
      setNotif({
        message: "Terjadi kesalahan koneksi saat menyimpan data.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNotif(null);
    }
  };

  const handleUploadExcel = async () => {
    if (!selectedFile) {
      setNotif({
        message: "Mohon pilih file Excel terlebih dahulu.",
        type: "error",
      });
      return;
    }
    if (!idTravelAgent) {
      setNotif({
        message: "Sesi travel agent tidak ditemukan. Silakan refresh.",
        type: "error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target?.result;
      if (!data) return;

      setLoading(true);
      try {
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
            password: "password123",
          }));

        let successCount = 0;
        const token = localStorage.getItem("token");

        for (const jamaahData of formattedData) {
          const response = await fetch("/api/web/jamaah", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(jamaahData),
          });
          if (response.ok) successCount++;
        }

        setNotif({
          message: `${successCount} dari ${formattedData.length} data berhasil diimpor.`,
          type: "success",
        });
        setSelectedFile(null);
      } catch (e) {
        setNotif({ message: "Gagal memproses file Excel.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  return (
    <div className="bg-slate-900 text-white min-h-full p-4 sm:p-6 lg:p-8 rounded-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Registrasi Jamaah</h1>
        <p className="mt-1 text-slate-400">
          Tambah data jamaah baru secara manual atau impor dari file Excel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* --- Left Column: Form --- */}
        <div className="lg:col-span-3 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            Input Manual
          </h2>
          {notif && <Notification message={notif.message} type={notif.type} />}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nama Lengkap"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama sesuai paspor"
                icon={FiUser}
              />
              <InputField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                type="email"
                icon={FiMail}
              />
              <InputField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 karakter"
                type="password"
                icon={FiLock}
              />
              <InputField
                label="No. Telepon"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                type="tel"
                icon={FiPhone}
              />
              <InputField
                label="No. Paspor"
                name="noPaspor"
                value={formData.noPaspor}
                onChange={handleChange}
                placeholder="C1234567"
                icon={FiFileText}
              />
              <InputField
                label="NIK"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="16 digit NIK"
                icon={FiCreditCard}
              />
            </div>
            <TextAreaField
              label="Alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              placeholder="Alamat lengkap saat ini"
            />
            <InputField
              label="Golongan Darah"
              name="golDarah"
              value={formData.golDarah}
              onChange={handleChange}
              placeholder="Contoh: A+"
              icon={FiHeart}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : "Simpan Data Jamaah"}
            </button>
          </form>
        </div>

        {/* --- Right Column: Excel Import --- */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              Impor Massal
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Gunakan template untuk mengimpor banyak data jamaah sekaligus.
            </p>

            <a
              href="/template/template-mabrurX.xlsx"
              download
              className="mb-6 flex items-center justify-center gap-2 w-full bg-slate-700/50 border border-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
            >
              <FiDownload />
              <span>Download Template</span>
            </a>

            <label
              htmlFor="file-upload"
              className="w-full cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-600 rounded-lg hover:bg-slate-700/50 hover:border-blue-500 transition-colors"
            >
              <FiUploadCloud className="h-10 w-10 text-slate-400 mb-2" />
              <span className="font-semibold text-blue-400">
                Pilih file untuk diupload
              </span>
              <span className="text-xs text-slate-500 mt-1">
                atau tarik dan lepas file di sini
              </span>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />

            {selectedFile && (
              <p className="mt-4 text-center text-sm text-green-400 animate-pulse">
                File siap diupload: {selectedFile.name}
              </p>
            )}

            <button
              onClick={handleUploadExcel}
              disabled={loading || !selectedFile}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Mengupload..." : "Upload & Proses File"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
