/*
  Warnings:

  - You are about to drop the column `status` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `orderitem` table. All the data in the column will be lost.
  - Added the required column `name` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `productId`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
