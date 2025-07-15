// prisma/seed.ts
import { PrismaClient } from '../app/generated/prisma'; // REVISI: Menggunakan import
import bcrypt from 'bcryptjs';                         // REVISI: Menggunakan import

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. Buat Roles
  const rolePPIH = await prisma.role.upsert({
    where: { name: "PPIH" }, update: {},
    create: { name: "PPIH", description: "Petugas Penyelenggara Ibadah Haji (Web)" },
  });
  const roleTravel = await prisma.role.upsert({
    where: { name: "Travel" }, update: {},
    create: { name: "Travel", description: "Admin Agen Travel (Web)" },
  });
  const rolePilgrim = await prisma.role.upsert({
    where: { name: "Pilgrim" }, update: {},
    create: { name: "Pilgrim", description: "Jemaah / Pengguna Aplikasi (Mobile)" },
  });
  const roleMutawali = await prisma.role.upsert({
    where: { name: "Mutawali" }, update: {},
    create: { name: "Mutawali", description: "Pemandu Ibadah / Mutawif (Mobile)" },
  });

  // 2. Enkripsi password
  const password123 = await bcrypt.hash("password123", 10);

  // 3. Buat Users
  const userPilgrim = await prisma.user.upsert({
    where: { email: "pilgrim@email.com" }, update: {},
    create: {
      email: "pilgrim@email.com",
      fullName: "Jemaah Pilgrim",
      password: password123,
      roleId: rolePilgrim.idRole,
    },
  });
  const userMutawali = await prisma.user.upsert({
    where: { email: "mutawali@email.com" }, update: {},
    create: {
      email: "mutawali@email.com",
      fullName: "Ahmad Mutawali",
      password: password123,
      roleId: roleMutawali.idRole,
    },
  });
  const userTravel = await prisma.user.upsert({
    where: { email: "travel@email.com" }, update: {},
    create: {
      email: "travel@email.com",
      fullName: "Admin Travel Agency",
      password: password123,
      roleId: roleTravel.idRole,
    },
  });
  const userPPIH = await prisma.user.upsert({
    where: { email: "ppih@email.com" }, update: {},
    create: {
      email: "ppih@email.com",
      fullName: "Petugas PPIH",
      password: password123,
      roleId: rolePPIH.idRole,
    },
  });

  console.log({ userPilgrim, userMutawali, userTravel, userPPIH });
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });