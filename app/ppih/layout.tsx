import type { Metadata } from "next";
import ClientSide from "./components/sidebarClient"; // Mengarah ke sidebar baru untuk PPIH

export const metadata: Metadata = {
  title: "PPIH Dashboard",
  description: "Dashboard for PPIH",
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