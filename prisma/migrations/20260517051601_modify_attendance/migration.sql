/*
  Warnings:

  - You are about to drop the column `isAbsent` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `isLate` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `employeeId` to the `ShiftSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'LATE', 'ABSENT', 'HALF_DAY');

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_scheduleId_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "isAbsent",
DROP COLUMN "isLate",
ADD COLUMN     "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT';

-- AlterTable
ALTER TABLE "ShiftSchedule" ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ShiftSchedule" ADD CONSTRAINT "ShiftSchedule_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
