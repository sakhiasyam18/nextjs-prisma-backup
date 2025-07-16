// prisma/seed.ts
import { PrismaClient } from "../app/generated/prisma"; // REVISI: Menggunakan import
import bcrypt from "bcryptjs"; // REVISI: Menggunakan import

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. Buat Roles
  const rolePPIH = await prisma.role.upsert({
    where: { name: "PPIH" },
    update: {},
    create: {
      name: "PPIH",
      description: "Petugas Penyelenggara Ibadah Haji (Web)",
    },
  });
  const roleTravel = await prisma.role.upsert({
    where: { name: "Travel" },
    update: {},
    create: { name: "Travel", description: "Admin Agen Travel (Web)" },
  });
  const rolePilgrim = await prisma.role.upsert({
    where: { name: "Pilgrim" },
    update: {},
    create: {
      name: "Pilgrim",
      description: "Jemaah / Pengguna Aplikasi (Mobile)",
    },
  });
  const roleMutawali = await prisma.role.upsert({
    where: { name: "Mutawali" },
    update: {},
    create: {
      name: "Mutawali",
      description: "Pemandu Ibadah / Mutawif (Mobile)",
    },
  });

  // 2. Enkripsi password
  const password123 = await bcrypt.hash("password123", 10);

  // 3. Buat Users
  const userPilgrim = await prisma.user.upsert({
    where: { email: "pilgrim@email.com" },
    update: {},
    create: {
      email: "pilgrim@email.com",
      fullName: "Jemaah Pilgrim",
      password: password123,
      roleId: rolePilgrim.idRole,
    },
  });
  const userMutawali = await prisma.user.upsert({
    where: { email: "mutawali@email.com" },
    update: {},
    create: {
      email: "mutawali@email.com",
      fullName: "Ahmad Mutawali",
      password: password123,
      roleId: roleMutawali.idRole,
    },
  });
  const userTravel = await prisma.user.upsert({
    where: { email: "travel@email.com" },
    update: {},
    create: {
      email: "travel@email.com",
      fullName: "Admin Travel Agency",
      password: password123,
      roleId: roleTravel.idRole,
    },
  });
  const userPPIH = await prisma.user.upsert({
    where: { email: "ppih@email.com" },
    update: {},
    create: {
      email: "ppih@email.com",
      fullName: "Petugas PPIH",
      password: password123,
      roleId: rolePPIH.idRole,
    },
  });

  await prisma.travelAgent.createMany({
    data: [
      {
        name: "Asyam Sakhi",
        address: "Malang",
        phone: "089513235456",
      },
      {
        name: "Rizky Ananda",
        address: "Surabaya",
        phone: "081234567890",
      },
      {
        name: "Dewi Lestari",
        address: "Bandung",
        phone: "082134567891",
      },
      {
        name: "Fajar Nugroho",
        address: "Yogyakarta",
        phone: "083145678912",
      },
      {
        name: "Intan Permata",
        address: "Jakarta",
        phone: "084156789123",
      },
      {
        name: "Bayu Saputra",
        address: "Semarang",
        phone: "085167891234",
      },
      {
        name: "Sinta Aulia",
        address: "Denpasar",
        phone: "086178912345",
      },
      {
        name: "Gilang Pratama",
        address: "Medan",
        phone: "087189123456",
      },
      {
        name: "Nadia Ramadhani",
        address: "Bekasi",
        phone: "088190234567",
      },
      {
        name: "Yusuf Maulana",
        address: "Depok",
        phone: "089201345678",
      },
      {
        name: "Tari Wulandari",
        address: "Tangerang",
        phone: "081212345678",
      },
      {
        name: "Reza Mahendra",
        address: "Bogor",
        phone: "082223456789",
      },
      {
        name: "Laras Ayu",
        address: "Padang",
        phone: "083234567890",
      },
      {
        name: "Dimas Ardiansyah",
        address: "Pontianak",
        phone: "084245678901",
      },
      {
        name: "Putri Anjani",
        address: "Palembang",
        phone: "085256789012",
      },
    ],
  });

  await prisma.ritualSection.createMany({
    data: [
      {
        name: "Tawaf",
        description: "Sudah dilakukan sejak 1 jam lalu",
        sequenceOrder: 1,
      },
      {
        name: "Sa’i",
        description: "Sedang dilakukan di antara bukit Safa dan Marwah",
        sequenceOrder: 2,
      },
      {
        name: "Wukuf di Arafah",
        description: "Dilaksanakan saat matahari tergelincir hingga maghrib",
        sequenceOrder: 3,
      },
      {
        name: "Mabit di Muzdalifah",
        description: "Menginap semalam setelah wukuf",
        sequenceOrder: 4,
      },
      {
        name: "Melempar Jumrah Aqabah",
        description: "Dilakukan pada tanggal 10 Dzulhijjah",
        sequenceOrder: 5,
      },
      {
        name: "Penyembelihan Hewan",
        description: "Bagian dari tahallul setelah lempar jumrah",
        sequenceOrder: 6,
      },
      {
        name: "Tahallul Awal",
        description: "Memotong sebagian rambut setelah kurban",
        sequenceOrder: 7,
      },
      {
        name: "Tawaf Ifadah",
        description: "Tawaf rukun setelah kembali dari Mina",
        sequenceOrder: 8,
      },
      {
        name: "Sa’i Ifadah",
        description: "Jika belum dilakukan setelah tawaf ifadah",
        sequenceOrder: 9,
      },
      {
        name: "Mabit di Mina",
        description: "Menginap selama hari Tasyrik",
        sequenceOrder: 10,
      },
      {
        name: "Melempar Jumrah Ula, Wustha, Aqabah",
        description: "Dilakukan selama hari Tasyrik",
        sequenceOrder: 11,
      },
      {
        name: "Tawaf Wada’",
        description: "Tawaf perpisahan sebelum meninggalkan Makkah",
        sequenceOrder: 12,
      },
      {
        name: "Niat Haji",
        description: "Dilakukan di Miqat sebelum masuk Makkah",
        sequenceOrder: 0,
      },
      {
        name: "Istirahat di Mina",
        description: "Menunggu hari wukuf di Arafah",
        sequenceOrder: 13,
      },
      {
        name: "Doa Bersama",
        description: "Setelah melempar jumrah di hari Tasyrik",
        sequenceOrder: 14,
      },
    ],
  });
  await prisma.statusProgress.createMany({
    data: [
      {
        status: "Selesai",
        completedAt: new Date("2025-07-15T08:00:00Z"),
        updatedAt: new Date(),
        userId: "user1",
        ritualSectionId: "ritual1", // Tawaf
      },
      {
        status: "Sedang_Dikerjakan",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user2",
        ritualSectionId: "ritual2", // Sa’i
      },
      {
        status: "Belum_Dimulai",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user3",
        ritualSectionId: "ritual3", // Wukuf di Arafah
      },
      {
        status: "Belum_Dimulai",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user4",
        ritualSectionId: "ritual4", // Mabit di Muzdalifah
      },
      {
        status: "Belum_Dimulai",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user5",
        ritualSectionId: "ritual5", // Melempar Jumrah Aqabah
      },
      {
        status: "Belum_Dimulai",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user6",
        ritualSectionId: "ritual6", // Penyembelihan Hewan
      },
      {
        status: "Belum_Dimulai",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user7",
        ritualSectionId: "ritual7", // Tahallul Awal
      },
      {
        status: "Belum_Dimulai",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user8",
        ritualSectionId: "ritual8", // Tawaf Ifadah
      },
      {
        status: "Belum_Dimulai",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user9",
        ritualSectionId: "ritual9", // Sa’i Ifadah
      },
      {
        status: "Belum_Dimulai",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user10",
        ritualSectionId: "ritual10", // Mabit di Mina
      },
      {
        status: "Belum_Dimulai",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user11",
        ritualSectionId: "ritual11", // Melempar Jumrah Tasyrik
      },
      {
        status: "Belum_Dimulai",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user12",
        ritualSectionId: "ritual12", // Tawaf Wada’
      },
      {
        status: "Selesai",
        completedAt: new Date("2025-07-14T07:00:00Z"),
        updatedAt: new Date(),
        userId: "user13",
        ritualSectionId: "ritual13", // Niat Haji
      },
      {
        status: "Sedang_Dikerjakan",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user14",
        ritualSectionId: "ritual14", // Istirahat di Mina
      },
      {
        status: "Belum_Dimulai",
        completedAt: null,
        updatedAt: new Date(),
        userId: "user15",
        ritualSectionId: "ritual15", // Doa Bersama
      },
    ],
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
