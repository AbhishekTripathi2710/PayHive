/*
  Warnings:

  - A unique constraint covering the columns `[gatewayInvoiceId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Invoice_gatewayInvoiceId_key` ON `Invoice`(`gatewayInvoiceId`);
