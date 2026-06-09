import { PrismaPg } from '@prisma/adapter-pg';
import {
  EmploymentStatus,
  EmploymentType,
  LeaveCategory,
  PrismaClient,
} from 'src/generated/prisma/client';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // ---------------------------------------------------------
  // 1. Create Permissions (Using Promise.all for guaranteed IDs)
  // ---------------------------------------------------------
  const permissionsData = [
    {
      resource: 'employees',
      action: 'create',
      description: 'Create employee records',
    },
    {
      resource: 'employees',
      action: 'read',
      description: 'View employee records',
    },
    {
      resource: 'employees',
      action: 'update',
      description: 'Update employee records',
    },
    {
      resource: 'employees',
      action: 'delete',
      description: 'Delete employee records',
    },
    {
      resource: 'leave_requests',
      action: 'approve',
      description: 'Approve or reject leave requests',
    },
    {
      resource: 'leave_requests',
      action: 'create',
      description: 'Create own leave requests',
    },
    {
      resource: 'leave_requests',
      action: 'read',
      description: 'View own leave requests',
    },
  ];

  console.log('Creating Permissions...');
  // We use upsert so you can safely run the seed script multiple times without crashing
  const createdPermissions = await Promise.all(
    permissionsData.map((p) =>
      prisma.permission.upsert({
        where: { resource_action: { resource: p.resource, action: p.action } },
        update: {},
        create: p,
      }),
    ),
  );

  // ---------------------------------------------------------
  // 2. Create Roles & Connect Permissions
  // ---------------------------------------------------------
  console.log('Creating Roles...');

  // HR gets everything
  const hrPermissions = createdPermissions.map((p) => ({ permissionId: p.id }));

  // Standard Employees only get specific leave request access
  const employeePermissions = createdPermissions
    .filter(
      (p) =>
        p.resource === 'leave_requests' &&
        (p.action === 'create' || p.action === 'read'),
    )
    .map((p) => ({ permissionId: p.id }));

  const hrRole = await prisma.role.upsert({
    where: { name: 'HR_MANAGER' },
    update: {},
    create: {
      name: 'HR_MANAGER',
      description: 'Human Resources Manager',
      rolePermissions: {
        create: hrPermissions, // Prisma's nested write links them atomically
      },
    },
  });

  const empRole = await prisma.role.upsert({
    where: { name: 'EMPLOYEE' },
    update: {},
    create: {
      name: 'EMPLOYEE',
      description: 'Standard Employee',
      rolePermissions: {
        create: employeePermissions,
      },
    },
  });

  // ---------------------------------------------------------
  // 3. Create Departments & Positions
  // ---------------------------------------------------------
  console.log('Creating Departments and Positions...');
  const engineeringDept = await prisma.department.upsert({
    where: { code: 'ENG' },
    update: {},
    create: {
      name: 'Engineering',
      code: 'ENG',
      description: 'Software Development Team',
      positions: {
        create: [
          { title: 'Frontend Developer' },
          { title: 'Backend Developer' },
        ],
      },
    },
  });

  const hrDept = await prisma.department.upsert({
    where: { code: 'HR' },
    update: {},
    create: {
      name: 'Human Resources',
      code: 'HR',
      description: 'HR and Operations',
      positions: {
        create: [{ title: 'HR Manager' }],
      },
    },
  });

  // Extract positions to assign to employees later
  const hrManagerPosition = await prisma.position.findFirst({
    where: { title: 'HR Manager' },
  });
  const backendPosition = await prisma.position.findFirst({
    where: { title: 'Backend Developer' },
  });

  console.log('Creating Employees & User Accounts...');
  const defaultPassword = await bcrypt.hash('123456aA', 10);

  // 1. Create the Users first
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hrm.com' },
    update: {},
    create: {
      email: 'admin@hrm.com',
      passwordHash: defaultPassword,
      roleId: hrRole.id,
    },
  });

  const standardUser = await prisma.user.upsert({
    where: { email: 'john.doe@hrm.com' },
    update: {},
    create: {
      email: 'john.doe@hrm.com',
      passwordHash: defaultPassword,
      roleId: empRole.id,
    },
  });

  // 2. Create the Employees using the raw scalar IDs
  const adminEmployee = await prisma.employee.upsert({
    where: { email: 'admin@hrm.com' },
    update: {},
    create: {
      employeeNumber: 'EMP-001',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'admin@hrm.com',
      hireDate: new Date('2022-01-15'),
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
      departmentId: hrDept.id,
      positionId: hrManagerPosition?.id,
      userId: adminUser.id, // <-- Using the scalar ID cleanly
    },
  });

  const standardEmployee = await prisma.employee.upsert({
    where: { email: 'john.doe@hrm.com' },
    update: {},
    create: {
      employeeNumber: 'EMP-002',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@hrm.com',
      hireDate: new Date('2024-03-01'),
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
      departmentId: engineeringDept.id,
      positionId: backendPosition?.id,
      userId: standardUser.id, // <-- Using the scalar ID cleanly
    },
  });
  console.log('Creating Leave Policies...');
  const currentYear = new Date().getFullYear();

  // We use findFirst to check if it exists so we don't duplicate on re-seeds
  let annualLeave = await prisma.leaveType.findFirst({
    where: { name: 'Annual Leave' },
  });
  if (!annualLeave) {
    annualLeave = await prisma.leaveType.create({
      data: {
        name: 'Annual Leave',
        category: LeaveCategory.ANNUAL,
        isPaid: true,
      },
    });
  }

  // Grant 15 days of annual leave to John Doe
  await prisma.leaveBalance.upsert({
    where: {
      employeeId_leaveTypeId_year: {
        employeeId: standardEmployee.id,
        leaveTypeId: annualLeave.id,
        year: currentYear,
      },
    },
    update: {},
    create: {
      employeeId: standardEmployee.id,
      leaveTypeId: annualLeave.id,
      year: currentYear,
      entitled: 15,
      used: 0,
    },
  });
  // ---------------------------------------------------------
  // 6. Create Shifts and Schedules for 2026
  // ---------------------------------------------------------
  console.log('Creating Shifts & Schedules...');

  // 1. Create a baseline Shift
  // We use findFirst to check if it exists so we don't duplicate on re-seeds
  let dayShift = await prisma.shift.findFirst({
    where: { name: 'Standard Day Shift' },
  });
  if (!dayShift) {
    dayShift = await prisma.shift.create({
      data: {
        name: 'Standard Day Shift',
        startTime: '09:00', // Matches your string format
        endTime: '17:00',
        breakMins: 60,
      },
    });
  }

  // 2. Assign the shift to John Doe for the entire year of 2026
  let existingSchedule = await prisma.shiftSchedule.findFirst({
    where: {
      employeeId: standardEmployee.id, // Using the employee we created in Step 4
      shiftId: dayShift.id,
      startDate: new Date('2026-01-01T00:00:00Z'),
    },
  });

  if (!existingSchedule) {
    await prisma.shiftSchedule.create({
      data: {
        employeeId: standardEmployee.id,
        shiftId: dayShift.id,
        startDate: new Date('2026-01-01T00:00:00Z'),
        endDate: new Date('2026-12-31T23:59:59Z'), // Spans the entirety of 2026
      },
    });
  }

  console.log('Creating payroll...');
  const john = await prisma.employee.findUnique({
    where: {
      email: 'john.doe@hrm.com',
    },
  });
  if (john) {
    await prisma.payrollInfo.upsert({
      where: { employeeId: john.id },
      update: {},
      create: {
        employeeId: john.id,
        payType: 'SALARY',
        payFrequency: 'MONTHLY',
        baseSalary: 5000000,
        currency: 'VND',
        taxCode: 'TAX-123456789',
        taxExemptions: 1, // e.g., 1 dependent

        allowances: {
          create: [
            {
              name: 'Internet Allowance',
              amount: 500000,
              isTaxable: false,
              isRecurring: true,
            },
            {
              name: 'Lunch Allowance',
              amount: 1000000,
              isTaxable: true,
              isRecurring: true,
            },
          ],
        },
        deductions: {
          create: [
            {
              name: 'Health Insurance',
              percentage: 1.5,
              isPreTax: true,
              isRecurring: true,
            },
            {
              name: 'Social Insurance',
              percentage: 8.0,
              isPreTax: true,
              isRecurring: true,
            },
          ],
        },
      },
    });
  }
  console.log('✅ Payroll Info seeded successfully');

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed thất bại:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
