// prisma/seed.ts
import { PrismaClient } from "../app/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 0. Delete all existing data
  console.log(`Deleting previous data...`);
  // Delete records with foreign keys first to avoid constraint errors
  await prisma.jamaahAsset.deleteMany({});
  await prisma.statusProgress.deleteMany({});
  await prisma.checklist.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.schedule.deleteMany({});
  await prisma.gpsLocation.deleteMany({});
  await prisma.travelPeriod.deleteMany({});
  // Now delete User records, which are referenced by the tables above
  await prisma.user.deleteMany({});
  // Finally, delete the independent tables
  await prisma.role.deleteMany({});
  await prisma.travelAgent.deleteMany({});
  await prisma.ritualSection.deleteMany({});
  console.log(`Previous data deleted.`);

  // 1. Create Roles
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

  // 2. Encrypt password
  const password123 = await bcrypt.hash("password123", 10);

  // 3. Create Travel Agents
  await prisma.travelAgent.createMany({
    data: [
      {
        name: "Jemaah Pilgrim",
        address: "Dwidaya Tour",
        phone: "089513235456",
      },
      {
        name: "Petugas PPIH",
        address: "Journey Holidays",
        phone: "081234567890",
      },
      {
        name: "Admin Travel Agency",
        address: "Oceania Travel Co ",
        phone: "082134567891",
      },
    ],
  });
  const createdTravelAgents = await prisma.travelAgent.findMany();

  // 4. Create Users
  await prisma.user.createMany({
    data: [
      {
        email: "pilgrim1@email.com",
        fullName: "Jemaah Pilgrim",
        password: password123,
        roleId: rolePilgrim.idRole,
        travelAgentId: createdTravelAgents[0].idTravelAgent,
      },
      {
        email: "mutawali1@email.com",
        fullName: "Ahmad Mutawali",
        password: password123,
        roleId: roleMutawali.idRole,
        travelAgentId: createdTravelAgents[0].idTravelAgent,
      },
      {
        email: "travel1@email.com",
        fullName: "Admin Travel Agency",
        password: password123,
        roleId: roleTravel.idRole,
        travelAgentId: createdTravelAgents[0].idTravelAgent,
      },
      {
        email: "ppih1@email.com",
        fullName: "Petugas PPIH",
        password: password123,
        roleId: rolePPIH.idRole,
      },
      {
        email: "pilgrim2@email.com",
        fullName: "Jemaah Pilgrim",
        password: password123,
        roleId: rolePilgrim.idRole,
        travelAgentId: createdTravelAgents[1].idTravelAgent,
      },
      {
        email: "mutawali2@email.com",
        fullName: "Budi Mutawali",
        password: password123,
        roleId: roleMutawali.idRole,
        travelAgentId: createdTravelAgents[1].idTravelAgent,
      },
      {
        email: "travel2@email.com",
        fullName: "Admin Travel Agency",
        password: password123,
        roleId: roleTravel.idRole,
        travelAgentId: createdTravelAgents[1].idTravelAgent,
      },
      {
        email: "ppih2@email.com",
        fullName: "Petugas PPIH",
        password: password123,
        roleId: rolePPIH.idRole,
      },
      {
        email: "pilgrim3@email.com",
        fullName: "Jemaah Pilgrim",
        password: password123,
        roleId: rolePilgrim.idRole,
        travelAgentId: createdTravelAgents[2].idTravelAgent,
      },
      {
        email: "mutawali3@email.com",
        fullName: "Citra Mutawali",
        password: password123,
        roleId: roleMutawali.idRole,
        travelAgentId: createdTravelAgents[2].idTravelAgent,
      },
      {
        email: "pilgrim4@email.com",
        fullName: "Jemaah Pilgrim",
        password: password123,
        roleId: rolePilgrim.idRole,
        travelAgentId: createdTravelAgents[0].idTravelAgent, // Assuming a valid index
      },
      {
        email: "mutawali4@email.com",
        fullName: "Doni Mutawali",
        password: password123,
        roleId: roleMutawali.idRole,
        travelAgentId: createdTravelAgents[0].idTravelAgent, // Assuming a valid index
      },
      {
        email: "pilgrim5@email.com",
        fullName: "Jemaah Pilgrim",
        password: password123,
        roleId: rolePilgrim.idRole,
        travelAgentId: createdTravelAgents[1].idTravelAgent, // Assuming a valid index
      },
      {
        email: "mutawali5@email.com",
        fullName: "Eka Mutawali",
        password: password123,
        roleId: roleMutawali.idRole,
        travelAgentId: createdTravelAgents[1].idTravelAgent, // Assuming a valid index
      },
      {
        email: "ppih3@email.com",
        fullName: "Petugas PPIH",
        password: password123,
        roleId: rolePPIH.idRole,
      },
    ],
  });
  const createdUsers = await prisma.user.findMany();

  // 5. Create Ritual Sections
  await prisma.ritualSection.createMany({
    data: [
      {
        name: "Niat Haji",
        description: "Dilakukan di Miqat sebelum masuk Makkah",
        sequenceOrder: 0,
      },
      {
        name: "Tawaf",
        description: "Sudah dilakukan sejak 1 jam lalu",
        sequenceOrder: 1,
      },
      {
        name: "Sai",
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
        name: "Tawaf Wada",
        description: "Tawaf perpisahan sebelum meninggalkan Makkah",
        sequenceOrder: 12,
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
  const createdRitualSections = await prisma.ritualSection.findMany();

  // 6. Create Status Progress
  await prisma.statusProgress.createMany({
    data: [
      {
        status: "Selesai",
        completedAt: new Date("2025-07-15T08:00:00Z"),
        userId: createdUsers[0].idUser,
        ritualSectionId: createdRitualSections[1].idRitualSection,
      },
      {
        status: "Sedang_Dikerjakan",
        userId: createdUsers[0].idUser,
        ritualSectionId: createdRitualSections[2].idRitualSection,
      },
      {
        status: "Selesai",
        completedAt: new Date("2025-07-15T09:00:00Z"),
        userId: createdUsers[4].idUser,
        ritualSectionId: createdRitualSections[1].idRitualSection,
      },
      {
        status: "Sedang_Dikerjakan",
        userId: createdUsers[4].idUser,
        ritualSectionId: createdRitualSections[2].idRitualSection,
      },
      {
        status: "Belum_Dimulai",
        userId: createdUsers[8].idUser,
        ritualSectionId: createdRitualSections[0].idRitualSection,
      },
      {
        status: "Selesai",
        completedAt: new Date("2025-07-14T07:00:00Z"),
        userId: createdUsers[0].idUser,
        ritualSectionId: createdRitualSections[0].idRitualSection,
      },
      {
        status: "Belum_Dimulai",
        userId: createdUsers[1].idUser,
        ritualSectionId: createdRitualSections[3].idRitualSection,
      },
      {
        status: "Sedang_Dikerjakan",
        userId: createdUsers[2].idUser,
        ritualSectionId: createdRitualSections[4].idRitualSection,
      },
      {
        status: "Selesai",
        completedAt: new Date("2025-07-16T10:00:00Z"),
        userId: createdUsers[3].idUser,
        ritualSectionId: createdRitualSections[5].idRitualSection,
      },
      {
        status: "Belum_Dimulai",
        userId: createdUsers[5].idUser,
        ritualSectionId: createdRitualSections[6].idRitualSection,
      },
      {
        status: "Sedang_Dikerjakan",
        userId: createdUsers[6].idUser,
        ritualSectionId: createdRitualSections[7].idRitualSection,
      },
      {
        status: "Selesai",
        completedAt: new Date("2025-07-17T11:00:00Z"),
        userId: createdUsers[7].idUser,
        ritualSectionId: createdRitualSections[8].idRitualSection,
      },
      {
        status: "Belum_Dimulai",
        userId: createdUsers[9].idUser,
        ritualSectionId: createdRitualSections[9].idRitualSection,
      },
      {
        status: "Sedang_Dikerjakan",
        userId: createdUsers[10].idUser,
        ritualSectionId: createdRitualSections[10].idRitualSection,
      },
      {
        status: "Selesai",
        completedAt: new Date("2025-07-18T12:00:00Z"),
        userId: createdUsers[11].idUser,
        ritualSectionId: createdRitualSections[11].idRitualSection,
      },
    ],
  });

  // 7. Create Checklists
  await prisma.checklist.createMany({
    data: [
      {
        itemName: "Kain Ihram",
        isCompleted: true,
        userId: createdUsers[0].idUser,
      },
      {
        itemName: "Sabuk Haji",
        isCompleted: true,
        userId: createdUsers[0].idUser,
      },
      {
        itemName: "Sandal Haji",
        isCompleted: false,
        userId: createdUsers[0].idUser,
      },
      { itemName: "Paspor", isCompleted: true, userId: createdUsers[4].idUser },
      { itemName: "Visa", isCompleted: true, userId: createdUsers[4].idUser },
      {
        itemName: "Tiket Pesawat",
        isCompleted: false,
        userId: createdUsers[4].idUser,
      },
      {
        itemName: "Obat-obatan Pribadi",
        isCompleted: true,
        userId: createdUsers[8].idUser,
      },
      {
        itemName: "Buku Manasik",
        isCompleted: false,
        userId: createdUsers[8].idUser,
      },
      {
        itemName: "Pakaian Sehari-hari",
        isCompleted: true,
        userId: createdUsers[1].idUser,
      },
      {
        itemName: "Perlengkapan Mandi",
        isCompleted: true,
        userId: createdUsers[1].idUser,
      },
      {
        itemName: "Uang Tunai",
        isCompleted: true,
        userId: createdUsers[2].idUser,
      },
      {
        itemName: "Botol Minum",
        isCompleted: false,
        userId: createdUsers[3].idUser,
      },
      {
        itemName: "Kacamata Hitam",
        isCompleted: true,
        userId: createdUsers[5].idUser,
      },
      {
        itemName: "Payung Kecil",
        isCompleted: false,
        userId: createdUsers[6].idUser,
      },
      {
        itemName: "Gunting Kuku",
        isCompleted: true,
        userId: createdUsers[7].idUser,
      },
    ],
  });

  // 8. Create Documents
  await prisma.document.createMany({
    data: [
      {
        documentType: "Paspor",
        filePath: "/docs/paspor_jemaah1.pdf",
        status: "Diverifikasi",
        userId: createdUsers[0].idUser,
      },
      {
        documentType: "KTP",
        filePath: "/docs/ktp_jemaah1.pdf",
        status: "Diverifikasi",
        userId: createdUsers[0].idUser,
      },
      {
        documentType: "Visa",
        filePath: "/docs/visa_jemaah2.pdf",
        status: "Menunggu_Verifikasi",
        userId: createdUsers[4].idUser,
      },
      {
        documentType: "Sertifikat Vaksin",
        filePath: "/docs/vaksin_jemaah2.pdf",
        status: "Ditolak",
        userId: createdUsers[4].idUser,
      },
      {
        documentType: "Paspor",
        filePath: "/docs/paspor_jemaah3.pdf",
        status: "Diverifikasi",
        userId: createdUsers[8].idUser,
      },
      {
        documentType: "Akta Kelahiran",
        filePath: "/docs/akta_jemaah3.pdf",
        status: "Menunggu_Verifikasi",
        userId: createdUsers[8].idUser,
      },
      {
        documentType: "Paspor",
        filePath: "/docs/paspor_mutawali1.pdf",
        status: "Diverifikasi",
        userId: createdUsers[1].idUser,
      },
      {
        documentType: "Sertifikat Pembimbing",
        filePath: "/docs/sertifikat_mutawali1.pdf",
        status: "Diverifikasi",
        userId: createdUsers[1].idUser,
      },
      {
        documentType: "Visa",
        filePath: "/docs/visa_mutawali2.pdf",
        status: "Menunggu_Verifikasi",
        userId: createdUsers[5].idUser,
      },
      {
        documentType: "KTP",
        filePath: "/docs/ktp_mutawali3.pdf",
        status: "Ditolak",
        userId: createdUsers[9].idUser,
      },
      {
        documentType: "Paspor",
        filePath: "/docs/paspor_jemaah4.pdf",
        status: "Diverifikasi",
        userId: createdUsers[10].idUser,
      },
      {
        documentType: "Paspor",
        filePath: "/docs/paspor_jemaah5.pdf",
        status: "Menunggu_Verifikasi",
        userId: createdUsers[12].idUser,
      },
      {
        documentType: "KTP",
        filePath: "/docs/ktp_ppih1.pdf",
        status: "Diverifikasi",
        userId: createdUsers[3].idUser,
      },
      {
        documentType: "Surat Tugas",
        filePath: "/docs/surat_tugas_ppih2.pdf",
        status: "Diverifikasi",
        userId: createdUsers[7].idUser,
      },
      {
        documentType: "ID Card",
        filePath: "/docs/id_travel1.pdf",
        status: "Diverifikasi",
        userId: createdUsers[2].idUser,
      },
    ],
  });

  // 9. Create Jamaah Assets
  const ppihUserForVerification = await prisma.user.findFirst({
    where: { role: { name: "PPIH" } },
  });
  if (ppihUserForVerification) {
    await prisma.jamaahAsset.createMany({
      data: [
        {
          name: "Koper",
          status: "Sudah_Diverifikasi",
          verifiedAt: new Date(),
          userId: createdUsers[0].idUser,
          verifiedById: ppihUserForVerification.idUser,
        },
        {
          name: "Tas Paspor",
          status: "Sudah_Diverifikasi",
          verifiedAt: new Date(),
          userId: createdUsers[0].idUser,
          verifiedById: ppihUserForVerification.idUser,
        },
        {
          name: "Gawai",
          status: "Belum_Diverifikasi",
          userId: createdUsers[4].idUser,
        },
        {
          name: "Charger",
          status: "Belum_Diverifikasi",
          userId: createdUsers[4].idUser,
        },
        {
          name: "Koper",
          status: "Sudah_Diverifikasi",
          verifiedAt: new Date(),
          userId: createdUsers[8].idUser,
          verifiedById: ppihUserForVerification.idUser,
        },
        {
          name: "Tas Jinjing",
          status: "Belum_Diverifikasi",
          userId: createdUsers[8].idUser,
        },
        {
          name: "Kamera",
          status: "Belum_Diverifikasi",
          userId: createdUsers[1].idUser,
        },
        {
          name: "Laptop",
          status: "Sudah_Diverifikasi",
          verifiedAt: new Date(),
          userId: createdUsers[2].idUser,
          verifiedById: ppihUserForVerification.idUser,
        },
        {
          name: "Handy Talky",
          status: "Sudah_Diverifikasi",
          verifiedAt: new Date(),
          userId: createdUsers[3].idUser,
          verifiedById: ppihUserForVerification.idUser,
        },
        {
          name: "Koper",
          status: "Belum_Diverifikasi",
          userId: createdUsers[5].idUser,
        },
        {
          name: "Tas Selempang",
          status: "Belum_Diverifikasi",
          userId: createdUsers[6].idUser,
        },
        {
          name: "Powerbank",
          status: "Sudah_Diverifikasi",
          verifiedAt: new Date(),
          userId: createdUsers[7].idUser,
          verifiedById: ppihUserForVerification.idUser,
        },
        {
          name: "Bantal Leher",
          status: "Belum_Diverifikasi",
          userId: createdUsers[10].idUser,
        },
        {
          name: "Koper",
          status: "Sudah_Diverifikasi",
          verifiedAt: new Date(),
          userId: createdUsers[11].idUser,
          verifiedById: ppihUserForVerification.idUser,
        },
        {
          name: "Obat P3K",
          status: "Sudah_Diverifikasi",
          verifiedAt: new Date(),
          userId: createdUsers[12].idUser,
          verifiedById: ppihUserForVerification.idUser,
        },
      ],
    });
  }

  // 10. Create Schedules
  await prisma.schedule.createMany({
    data: [
      {
        activity: "Manasik Haji",
        location: "Asrama Haji",
        startTime: new Date("2025-07-10T09:00:00Z"),
        endTime: new Date("2025-07-10T12:00:00Z"),
        userId: createdUsers[0].idUser,
      },
      {
        activity: "Keberangkatan ke Jeddah",
        location: "Bandara Juanda",
        startTime: new Date("2025-07-12T22:00:00Z"),
        endTime: new Date("2025-07-13T08:00:00Z"),
        userId: createdUsers[0].idUser,
      },
      {
        activity: "Pelaksanaan Tawaf",
        location: "Masjidil Haram",
        startTime: new Date("2025-07-14T10:00:00Z"),
        endTime: new Date("2025-07-14T11:00:00Z"),
        userId: createdUsers[4].idUser,
      },
      {
        activity: "Wukuf di Arafah",
        location: "Arafah",
        startTime: new Date("2025-07-19T12:00:00Z"),
        endTime: new Date("2025-07-19T18:00:00Z"),
        userId: createdUsers[8].idUser,
      },
      {
        activity: "Briefing Pagi",
        location: "Hotel Mekkah",
        startTime: new Date("2025-07-14T08:00:00Z"),
        endTime: new Date("2025-07-14T09:00:00Z"),
        userId: createdUsers[1].idUser,
      },
      {
        activity: "Mabit di Muzdalifah",
        location: "Muzdalifah",
        startTime: new Date("2025-07-19T20:00:00Z"),
        endTime: new Date("2025-07-20T04:00:00Z"),
        userId: createdUsers[5].idUser,
      },
      {
        activity: "Koordinasi dengan PPIH",
        location: "Kantor Misi Haji",
        startTime: new Date("2025-07-11T14:00:00Z"),
        endTime: new Date("2025-07-11T15:00:00Z"),
        userId: createdUsers[2].idUser,
      },
      {
        activity: "Pemantauan Jemaah",
        location: "Area Jamarat",
        startTime: new Date("2025-07-20T09:00:00Z"),
        endTime: new Date("2025-07-20T12:00:00Z"),
        userId: createdUsers[3].idUser,
      },
      {
        activity: "Tawaf Ifadah",
        location: "Masjidil Haram",
        startTime: new Date("2025-07-21T05:00:00Z"),
        endTime: new Date("2025-07-21T06:00:00Z"),
        userId: createdUsers[10].idUser,
      },
      {
        activity: "Ziarah ke Jabal Nur",
        location: "Jabal Nur",
        startTime: new Date("2025-07-25T08:00:00Z"),
        endTime: new Date("2025-07-25T11:00:00Z"),
        userId: createdUsers[12].idUser,
      },
      {
        activity: "Pembagian Konsumsi",
        location: "Mina",
        startTime: new Date("2025-07-20T13:00:00Z"),
        endTime: new Date("2025-07-20T14:00:00Z"),
        userId: createdUsers[7].idUser,
      },
      {
        activity: "Bimbingan Sa'i",
        location: "Masjidil Haram",
        startTime: new Date("2025-07-14T11:00:00Z"),
        endTime: new Date("2025-07-14T12:00:00Z"),
        userId: createdUsers[9].idUser,
      },
      {
        activity: "Tawaf Wada'",
        location: "Masjidil Haram",
        startTime: new Date("2025-07-28T10:00:00Z"),
        endTime: new Date("2025-07-28T11:00:00Z"),
        userId: createdUsers[0].idUser,
      },
      {
        activity: "Kepulangan ke Tanah Air",
        location: "Bandara King Abdulaziz",
        startTime: new Date("2025-07-29T15:00:00Z"),
        endTime: new Date("2025-07-30T05:00:00Z"),
        userId: createdUsers[4].idUser,
      },
      {
        activity: "Evaluasi Kinerja",
        location: "Kantor Travel",
        startTime: new Date("2025-08-05T10:00:00Z"),
        endTime: new Date("2025-08-05T12:00:00Z"),
        userId: createdUsers[6].idUser,
      },
    ],
  });

  // 11. Create GPS Locations
  await prisma.gpsLocation.createMany({
    data: [
      { latitude: 21.4225, longitude: 39.8262, userId: createdUsers[0].idUser }, // Ka'bah
      { latitude: 21.4236, longitude: 39.8267, userId: createdUsers[4].idUser }, // Safa
      { latitude: 21.3543, longitude: 39.9839, userId: createdUsers[8].idUser }, // Arafah
      { latitude: 21.3833, longitude: 39.9167, userId: createdUsers[1].idUser }, // Muzdalifah
      { latitude: 21.4208, longitude: 39.8948, userId: createdUsers[5].idUser }, // Mina
      {
        latitude: 21.4225,
        longitude: 39.8262,
        userId: createdUsers[10].idUser,
      },
      {
        latitude: 21.6167,
        longitude: 39.1667,
        userId: createdUsers[12].idUser,
      }, // Jeddah
      {
        latitude: -7.2845,
        longitude: 112.7946,
        userId: createdUsers[2].idUser,
      }, // Surabaya
      {
        latitude: -6.2088,
        longitude: 106.8456,
        userId: createdUsers[3].idUser,
      }, // Jakarta
      {
        latitude: -7.9666,
        longitude: 112.6326,
        userId: createdUsers[6].idUser,
      }, // Malang
      {
        latitude: -6.9175,
        longitude: 107.6191,
        userId: createdUsers[7].idUser,
      }, // Bandung
      {
        latitude: -7.7956,
        longitude: 110.3695,
        userId: createdUsers[9].idUser,
      }, // Yogyakarta
      {
        latitude: 21.4225,
        longitude: 39.8262,
        userId: createdUsers[11].idUser,
      },
      {
        latitude: 21.4225,
        longitude: 39.8262,
        userId: createdUsers[13].idUser,
      },
      {
        latitude: 21.4225,
        longitude: 39.8262,
        userId: createdUsers[14].idUser,
      },
    ],
  });

  // 12. Create Travel Periods
  await prisma.travelPeriod.createMany({
    data: [
      {
        packageName: "Haji Reguler 2025",
        startDate: new Date("2025-07-12"),
        endDate: new Date("2025-08-10"),
        userId: createdUsers[0].idUser,
      },
      {
        packageName: "Haji Plus 2025",
        startDate: new Date("2025-07-10"),
        endDate: new Date("2025-08-05"),
        userId: createdUsers[4].idUser,
      },
      {
        packageName: "Haji Furoda 2025",
        startDate: new Date("2025-07-15"),
        endDate: new Date("2025-08-08"),
        userId: createdUsers[8].idUser,
      },
      {
        packageName: "Tugas Pembimbing Haji",
        startDate: new Date("2025-07-09"),
        endDate: new Date("2025-08-12"),
        userId: createdUsers[1].idUser,
      },
      {
        packageName: "Tugas Admin Travel",
        startDate: new Date("2025-07-01"),
        endDate: new Date("2025-08-15"),
        userId: createdUsers[2].idUser,
      },
      {
        packageName: "Penugasan PPIH Kloter 1",
        startDate: new Date("2025-07-08"),
        endDate: new Date("2025-08-13"),
        userId: createdUsers[3].idUser,
      },
      {
        packageName: "Haji Reguler 2025",
        startDate: new Date("2025-07-12"),
        endDate: new Date("2025-08-10"),
        userId: createdUsers[10].idUser,
      },
      {
        packageName: "Haji Plus 2025",
        startDate: new Date("2025-07-10"),
        endDate: new Date("2025-08-05"),
        userId: createdUsers[12].idUser,
      },
      {
        packageName: "Tugas Pembimbing Haji",
        startDate: new Date("2025-07-09"),
        endDate: new Date("2025-08-12"),
        userId: createdUsers[5].idUser,
      },
      {
        packageName: "Tugas Admin Travel",
        startDate: new Date("2025-07-01"),
        endDate: new Date("2025-08-15"),
        userId: createdUsers[6].idUser,
      },
      {
        packageName: "Penugasan PPIH Kloter 2",
        startDate: new Date("2025-07-09"),
        endDate: new Date("2025-08-14"),
        userId: createdUsers[7].idUser,
      },
      {
        packageName: "Tugas Pembimbing Haji",
        startDate: new Date("2025-07-09"),
        endDate: new Date("2025-08-12"),
        userId: createdUsers[9].idUser,
      },
      {
        packageName: "Tugas Pembimbing Haji",
        startDate: new Date("2025-07-09"),
        endDate: new Date("2025-08-12"),
        userId: createdUsers[13].idUser,
      },
      {
        packageName: "Penugasan PPIH Kloter 3",
        startDate: new Date("2025-07-10"),
        endDate: new Date("2025-08-15"),
        userId: createdUsers[14].idUser,
      },
      {
        packageName: "Haji Furoda 2025",
        startDate: new Date("2025-07-15"),
        endDate: new Date("2025-08-08"),
        userId: createdUsers[11].idUser,
      },
    ],
  });

  console.log({ createdUsers });
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
