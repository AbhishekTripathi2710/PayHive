-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `gatewayInvoiceId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Subscription` ADD COLUMN `stripeId` VARCHAR(191) NULL;
