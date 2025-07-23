--prisma/migrations/20250714103650_dataa/migration.sql
-- CreateTable
CREATE TABLE `roles` (
    `id_role` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id_role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `travel_agents` (
    `id_travel_agent` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(20) NULL,

    PRIMARY KEY (`id_travel_agent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id_user` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `travel_agent_id` VARCHAR(191) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ritual_sections` (
    `id_ritual_section` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `sequence_order` INTEGER NULL,

    PRIMARY KEY (`id_ritual_section`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status_progress` (
    `id_status_progress` VARCHAR(191) NOT NULL,
    `status` ENUM('Belum_Dimulai', 'Sedang_Dikerjakan', 'Selesai') NOT NULL DEFAULT 'Belum_Dimulai',
    `completed_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `ritual_section_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_status_progress`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checklists` (
    `id_checklist` VARCHAR(191) NOT NULL,
    `item_name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `is_completed` BOOLEAN NOT NULL DEFAULT false,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_checklist`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id_document` VARCHAR(191) NOT NULL,
    `document_type` VARCHAR(100) NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `status` ENUM('Menunggu_Verifikasi', 'Diverifikasi', 'Ditolak') NOT NULL DEFAULT 'Menunggu_Verifikasi',
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_document`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jamaah_assets` (
    `id_jamaah_asset` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('Belum_Diverifikasi', 'Sudah_Diverifikasi') NOT NULL DEFAULT 'Belum_Diverifikasi',
    `verified_at` DATETIME(3) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `verified_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id_jamaah_asset`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedules` (
    `id_schedule` VARCHAR(191) NOT NULL,
    `activity` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NULL,
    `start_time` DATETIME(3) NULL,
    `end_time` DATETIME(3) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_schedule`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gps_locations` (
    `id_gps_location` VARCHAR(191) NOT NULL,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_gps_location`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `travel_periods` (
    `id_travel_period` VARCHAR(191) NOT NULL,
    `package_name` VARCHAR(255) NOT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_travel_period`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id_role`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_travel_agent_id_fkey` FOREIGN KEY (`travel_agent_id`) REFERENCES `travel_agents`(`id_travel_agent`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status_progress` ADD CONSTRAINT `status_progress_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status_progress` ADD CONSTRAINT `status_progress_ritual_section_id_fkey` FOREIGN KEY (`ritual_section_id`) REFERENCES `ritual_sections`(`id_ritual_section`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checklists` ADD CONSTRAINT `checklists_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jamaah_assets` ADD CONSTRAINT `jamaah_assets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jamaah_assets` ADD CONSTRAINT `jamaah_assets_verified_by_fkey` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gps_locations` ADD CONSTRAINT `gps_locations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `travel_periods` ADD CONSTRAINT `travel_periods_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
