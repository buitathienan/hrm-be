import { PrismaPg } from '@prisma/adapter-pg';
import {
  AssetStatus,
  EmploymentStatus,
  EmploymentType,
  Gender,
  LeaveCategory,
  LeaveStatus,
  PayFrequency,
  PayType,
  PrismaClient,
} from 'src/generated/prisma/client';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ---------------------------------------------------------------------------
  // ROLE & PERMISSION
  // ---------------------------------------------------------------------------
  const role = await prisma.role.create({
    data: {
      name: 'HR Admin',
      description: 'Toàn quyền quản lý nhân sự',
    },
  });

  const permission = await prisma.permission.create({
    data: {
      resource: 'employees',
      action: 'manage',
      description: 'Tạo, xem, sửa, xoá hồ sơ nhân viên',
    },
  });

  await prisma.rolePermission.create({
    data: {
      roleId: role.id,
      permissionId: permission.id,
    },
  });

  // ---------------------------------------------------------------------------
  // USER
  // ---------------------------------------------------------------------------
  const user = await prisma.user.create({
    data: {
      email: 'alice@company.com',
      passwordHash: await bcrypt.hash('123456aA', 10),
      isActive: true,
      roleId: role.id,
    },
  });

  // ---------------------------------------------------------------------------
  // DEPARTMENT (chưa có head — vòng phụ thuộc với Employee)
  // ---------------------------------------------------------------------------
  const department = await prisma.department.create({
    data: {
      name: 'Kỹ thuật',
      code: 'ENG',
      description: 'Phòng phát triển phần mềm',
    },
  });

  // ---------------------------------------------------------------------------
  // POSITION
  // ---------------------------------------------------------------------------
  const position = await prisma.position.create({
    data: {
      title: 'Senior Software Engineer',
      code: 'SWE-SR',
      departmentId: department.id,
      minSalary: 30000000,
      maxSalary: 60000000,
      isActive: true,
    },
  });

  // ---------------------------------------------------------------------------
  // SHIFT & SHIFT SCHEDULE
  // ---------------------------------------------------------------------------
  const shift = await prisma.shift.create({
    data: {
      name: 'Ca sáng',
      startTime: '08:00',
      endTime: '17:00',
      breakMins: 60,
      isActive: true,
    },
  });

  const shiftSchedule = await prisma.shiftSchedule.create({
    data: {
      shiftId: shift.id,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
    },
  });

  // ---------------------------------------------------------------------------
  // EMPLOYEE
  // ---------------------------------------------------------------------------
  const employee = await prisma.employee.create({
    data: {
      employeeNumber: 'EMP-001',
      firstName: 'Alice',
      lastName: 'Nguyễn',
      email: 'alice.nguyen@personal.com',
      workEmail: 'alice@company.com',
      phone: '+84901234567',
      dateOfBirth: new Date('1992-05-15'),
      gender: Gender.FEMALE,
      hireDate: new Date('2022-03-01'),
      probationEnd: new Date('2022-06-01'),
      confirmationDate: new Date('2022-06-02'),
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
      positionId: position.id,
      departmentId: department.id,
      userId: user.id,
      scheduleId: shiftSchedule.id,
      address: '123 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    },
  });

  // ---------------------------------------------------------------------------
  // DEPARTMENT — cập nhật headId sau khi employee đã tồn tại
  // ---------------------------------------------------------------------------
  await prisma.department.update({
    where: { id: department.id },
    data: { headId: employee.id },
  });

  // ---------------------------------------------------------------------------
  // BANK ACCOUNT
  // ---------------------------------------------------------------------------
  await prisma.bankAccount.create({
    data: {
      employeeId: employee.id,
      accountName: 'NGUYEN THI ALICE',
      accountNumber: '0123456789',
      currency: 'VND',
    },
  });

  // ---------------------------------------------------------------------------
  // LEAVE TYPE & BALANCE & REQUEST
  // ---------------------------------------------------------------------------
  const leaveType = await prisma.leaveType.create({
    data: {
      name: 'Nghỉ phép năm',
      category: LeaveCategory.ANNUAL,
      isPaid: true,
      isActive: true,
      requiresApproval: true,
    },
  });

  await prisma.leaveBalance.create({
    data: {
      employeeId: employee.id,
      leaveTypeId: leaveType.id,
      year: 2025,
      entitled: 12,
      used: 2,
      pending: 1,
      carriedOver: 3,
    },
  });

  await prisma.leaveRequest.create({
    data: {
      employeeId: employee.id,
      leaveTypeId: leaveType.id,
      startDate: new Date('2025-04-10'),
      endDate: new Date('2025-04-11'),
      totalDays: 2,
      reason: 'Nghỉ du lịch gia đình',
      status: LeaveStatus.APPROVED,
      approverId: employee.id, // tự duyệt cho mục đích seed
      approvedAt: new Date('2025-04-08'),
    },
  });

  // ---------------------------------------------------------------------------
  // PUBLIC HOLIDAY
  // ---------------------------------------------------------------------------
  await prisma.publicHoliday.create({
    data: {
      name: 'Ngày Thống Nhất',
      date: new Date('2025-04-30'),
      isActive: true,
    },
  });

  // ---------------------------------------------------------------------------
  // ATTENDANCE
  // ---------------------------------------------------------------------------
  await prisma.attendance.create({
    data: {
      employeeId: employee.id,
      date: new Date('2025-04-01'),
      checkIn: new Date('2025-04-01T08:02:00'),
      checkOut: new Date('2025-04-01T17:05:00'),
      hoursWorked: 8.05,
      overtimeHours: 0,
      isLate: false,
      isAbsent: false,
      source: 'WEB',
    },
  });

  // ---------------------------------------------------------------------------
  // ASSET & ASSIGNMENT
  // ---------------------------------------------------------------------------
  const asset = await prisma.asset.create({
    data: {
      name: 'MacBook Pro 14-inch',
      category: 'Laptop',
      serialNumber: 'C02XK1HJJGH6',
      brand: 'Apple',
      model: 'MacBook Pro M3 Pro',
      purchaseDate: new Date('2024-01-15'),
      purchaseCost: 45000000,
      status: AssetStatus.ASSIGNED,
      notes: 'Thiết bị cấp phát của công ty',
    },
  });

  await prisma.assetAssignment.create({
    data: {
      assetId: asset.id,
      employeeId: employee.id,
      assignedAt: new Date('2024-01-20'),
      condition: 'New',
      notes: 'Cấp phát đầu Q1 2024',
    },
  });

  // ---------------------------------------------------------------------------
  // PAYROLL INFO, ALLOWANCE, DEDUCTION
  // ---------------------------------------------------------------------------
  const payrollInfo = await prisma.payrollInfo.create({
    data: {
      employeeId: employee.id,
      payType: PayType.SALARY,
      payFrequency: PayFrequency.MONTHLY,
      baseSalary: 45000000,
      currency: 'VND',
      taxCode: 'TX-001',
      taxExemptions: 1,
    },
  });

  await prisma.allowance.create({
    data: {
      payrollInfoId: payrollInfo.id,
      name: 'Phụ cấp ăn trưa',
      amount: 730000,
      isTaxable: false,
      isRecurring: true,
    },
  });

  await prisma.deduction.create({
    data: {
      payrollInfoId: payrollInfo.id,
      name: 'Bảo hiểm xã hội',
      percentage: 8,
      isPreTax: true,
      isRecurring: true,
    },
  });

  // ---------------------------------------------------------------------------
  // SALARY HISTORY
  // ---------------------------------------------------------------------------
  await prisma.salaryHistory.create({
    data: {
      employeeId: employee.id,
      oldSalary: 38000000,
      newSalary: 45000000,
      currency: 'VND',
      effectiveAt: new Date('2024-01-01'),
      reason: 'Tăng lương định kỳ hàng năm',
    },
  });

  // ---------------------------------------------------------------------------
  // PAYROLL RUN, PAYSLIP & LINE ITEM
  // ---------------------------------------------------------------------------
  const payrollRun = await prisma.payrollRun.create({
    data: {
      periodStart: new Date('2025-03-01'),
      periodEnd: new Date('2025-03-31'),
      payDate: new Date('2025-04-05'),
      status: 'COMPLETED',
      totalGross: 45730000,
      totalNet: 40000000,
      totalTax: 2130000,
      processedAt: new Date('2025-04-04'),
    },
  });

  const payslip = await prisma.payslip.create({
    data: {
      employeeId: employee.id,
      payrollRunId: payrollRun.id,
      grossPay: 45730000,
      netPay: 40000000,
      totalAllowance: 730000,
      totalDeduction: 3600000,
      totalTax: 2130000,
      currency: 'VND',
      paidAt: new Date('2025-04-05'),
    },
  });

  await prisma.payslipLineItem.create({
    data: {
      payslipId: payslip.id,
      name: 'Lương cơ bản',
      type: 'EARNING',
      amount: 45000000,
    },
  });

  console.log('✅ Seed hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Seed thất bại:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
