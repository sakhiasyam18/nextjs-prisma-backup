export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-red-500">
      <div className="space-y-4 rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-slate-800">Selamat Datang!</h1>
        <p className="text-slate-600">
          Aplikasi berjalan. Silakan ke halaman <a href="/login" className="text-blue-600 hover:underline">/login</a> untuk masuk.
        </p>
      </div>
    </main>
  );
}