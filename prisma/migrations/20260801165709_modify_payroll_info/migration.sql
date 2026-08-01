/*
  Warnings:

  - You are about to drop the column `taxCode` on the `PayrollInfo` table. All the data in the column will be lost.
  - You are about to drop the column `taxExemptions` on the `PayrollInfo` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `PayrollInfo` table. All the data in the column will be lost.
  - Added the required column `effectiveFrom` to the `PayrollInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PayrollInfo" DROP COLUMN "taxCode",
DROP COLUMN "taxExemptions",
DROP COLUMN "taxId",
ADD COLUMN     "effectiveFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "effectiveTo" TIMESTAMP(3);
