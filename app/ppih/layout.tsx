//app/ppih/layout.tsx
import type { Metadata } from "next";
import ClientSide from "./components/sidebarClient"; // Mengarah ke sidebar PPIH

// Metadata yang lebih deskriptif untuk SEO dan identitas halaman
export const metadata: Metadata = {
  title: "Portal Resmi PPIH",
  description:
    "Dashboard Manajemen untuk Petugas Penyelenggara Ibadah Haji (PPIH)",
};

export default function PpihLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <ClientSide /> {/* <-- Sidebar khusus PPIH */}
          <main className="flex-1 bg-gray-50 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}