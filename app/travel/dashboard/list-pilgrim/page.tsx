import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function DaftarJamaah() {
    const jamaah = await prisma.pilgrim.findMany();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Daftar Jamaah Terdaftar</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jamaah.map((jamaah) => (
                    <div key={jamaah.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold">{jamaah.nama}</h2>
                        <Link href={`/dashboard/pilgrims/${jamaah.id}`} className="text-blue-500 hover:underline mt-2 inline-block">
                            Lihat Detail
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}