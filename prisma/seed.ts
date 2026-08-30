import { PrismaPg } from '@prisma/adapter-pg';

import bcrypt from 'bcrypt';
import { Prisma, PrismaClient } from 'src/generated/prisma/client';

const d = (value: string) => new Prisma.Decimal(value);
const date = (value: string) => new Date(value);
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ---------------------------------------------------------------------------
  // 1. Roles & permissions
  // ---------------------------------------------------------------------------
  const permissions = [
    ['employee', 'read'],
    ['employee', 'write'],
    ['department', 'read'],
    ['department', 'write'],
    ['leave', 'read'],
    ['leave', 'write'],
    ['attendance', 'read'],
    ['attendance', 'write'],
    ['asset', 'read'],
    ['asset', 'write'],
    ['payroll', 'read'],
    ['payroll', 'write'],
  ];

  const permissionMap = new Map<string, string>();

  for (const [resource, action] of permissions) {
    const permission = await prisma.permission.upsert({
      where: { resource_action: { resource, action } },
      update: {},
      create: {
        resource,
        action,
        description: `${action.toUpperCase()} ${resource} records`,
      },
    });

    permissionMap.set(`${resource}:${action}`, permission.id);
  }

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Full system access',
    },
  });

  const hrRole = await prisma.role.upsert({
    where: { name: 'HR_MANAGER' },
    update: {},
    create: {
      name: 'HR_MANAGER',
      description: 'Human resources management access',
    },
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: 'EMPLOYEE' },
    update: {},
    create: {
      name: 'EMPLOYEE',
      description: 'Standard employee access',
    },
  });

  const allPermissionIds = [...permissionMap.values()];

  // Set all permissions for ADMIN role
  for (const permissionId of allPermissionIds) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId,
        },
      },
      update: {},
      create: { roleId: adminRole.id, permissionId },
    });
  }

  // Set permission for HR_MANAGER role
  for (const key of [
    'employee:read',
    'employee:write',
    'department:read',
    'department:write',
    'leave:read',
    'leave:write',
    'attendance:read',
    'attendance:write',
    'asset:read',
    'asset:write',
    'payroll:read',
    'payroll:write',
  ]) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: hrRole.id,
          permissionId: permissionMap.get(key)!,
        },
      },
      update: {},
      create: {
        roleId: hrRole.id,
        permissionId: permissionMap.get(key)!,
      },
    });
  }

  // Set permission for EMPLOYEE role
  for (const key of [
    'employee:read',
    'leave:read',
    'leave:write',
    'attendance:read',
    'attendance:write',
    'asset:read',
    'payroll:read',
  ]) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: employeeRole.id,
          permissionId: permissionMap.get(key)!,
        },
      },
      update: {},
      create: {
        roleId: employeeRole.id,
        permissionId: permissionMap.get(key)!,
      },
    });
  }

  const encryptedPassword = await bcrypt.hash('123456aA', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hrm.com' },
    update: {},
    create: {
      email: 'admin@hrm.com',
      passwordHash: encryptedPassword,
      roleId: adminRole.id,
    },
  });

  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@hrm.com' },
    update: {},
    create: {
      email: 'hr@hrm.com',
      passwordHash: encryptedPassword,
      roleId: hrRole.id,
    },
  });

  // ---------------------------------------------------------------------------
  // 2. Departments
  // ---------------------------------------------------------------------------
  const engineering = await prisma.department.upsert({
    where: { code: 'ENG' },
    update: {},
    create: {
      name: 'Engineering',
      code: 'ENG',
      description: 'Software engineering and technology',
    },
  });

  const humanResources = await prisma.department.upsert({
    where: { code: 'HR' },
    update: {},
    create: {
      name: 'Human Resources',
      code: 'HR',
      description: 'People operations and employee services',
    },
  });

  const finance = await prisma.department.upsert({
    where: { code: 'FIN' },
    update: {},
    create: {
      name: 'Finance',
      code: 'FIN',
      description: 'Finance and accounting',
    },
  });

  const product = await prisma.department.upsert({
    where: { code: 'PROD' },
    update: {},
    create: {
      name: 'Product',
      code: 'PROD',
      description: 'Product management and design',
    },
  });

  // ---------------------------------------------------------------------------
  // 3. Positions
  // ---------------------------------------------------------------------------
  const engineeringManager = await prisma.position.create({
    data: {
      title: 'Engineering Manager',
      code: 'ENG-MGR',
      departmentId: engineering.id,
      minSalary: d('50000000'),
      maxSalary: d('80000000'),
    },
  });

  const seniorEngineer = await prisma.position.create({
    data: {
      title: 'Senior Software Engineer',
      code: 'SWE-SR',
      departmentId: engineering.id,
      minSalary: d('35000000'),
      maxSalary: d('60000000'),
    },
  });

  const softwareEngineer = await prisma.position.create({
    data: {
      title: 'Software Engineer',
      code: 'SWE',
      departmentId: engineering.id,
      minSalary: d('20000000'),
      maxSalary: d('40000000'),
    },
  });

  const hrManagerPosition = await prisma.position.create({
    data: {
      title: 'HR Manager',
      code: 'HR-MGR',
      departmentId: humanResources.id,
      minSalary: d('30000000'),
      maxSalary: d('50000000'),
    },
  });

  const accountant = await prisma.position.create({
    data: {
      title: 'Accountant',
      code: 'ACC',
      departmentId: finance.id,
      minSalary: d('18000000'),
      maxSalary: d('35000000'),
    },
  });

  const productManager = await prisma.position.create({
    data: {
      title: 'Product Manager',
      code: 'PM',
      departmentId: product.id,
      minSalary: d('30000000'),
      maxSalary: d('55000000'),
    },
  });

  // ---------------------------------------------------------------------------
  // 4. Employees
  // ---------------------------------------------------------------------------
  const adminEmployee = await prisma.employee.create({
    data: {
      employeeNumber: 'EMP001',
      firstName: 'Alex',
      lastName: 'Nguyen',
      email: 'admin@hrm.com',
      workEmail: 'alex.nguyen@hrm.com',
      phone: '+84 900 000 001',
      dateOfBirth: date('1988-04-12'),
      gender: 'MALE',
      hireDate: date('2019-01-07'),
      confirmationDate: date('2019-04-07'),
      employmentType: 'FULL_TIME',
      employmentStatus: 'ACTIVE',
      positionId: engineeringManager.id,
      departmentId: engineering.id,
      address: 'District 1, Ho Chi Minh City',
      userId: adminUser.id,
    },
  });

  const hrEmployee = await prisma.employee.create({
    data: {
      employeeNumber: 'EMP002',
      firstName: 'Mai',
      lastName: 'Tran',
      email: 'hr@hrm.com',
      workEmail: 'mai.tran@hrm.com',
      phone: '+84 900 000 002',
      dateOfBirth: date('1990-09-21'),
      gender: 'FEMALE',
      hireDate: date('2020-02-10'),
      confirmationDate: date('2020-05-10'),
      employmentType: 'FULL_TIME',
      employmentStatus: 'ACTIVE',
      positionId: hrManagerPosition.id,
      departmentId: humanResources.id,
      address: 'Binh Thanh District, Ho Chi Minh City',
      userId: hrUser.id,
    },
  });

  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        employeeNumber: 'EMP003',
        firstName: 'Minh',
        lastName: 'Pham',
        email: 'minh.pham@hrm.com',
        workEmail: 'minh.pham@hrm.com',
        phone: '+84 900 000 003',
        dateOfBirth: date('1994-03-15'),
        gender: 'MALE',
        hireDate: date('2022-06-01'),
        confirmationDate: date('2022-09-01'),
        employmentType: 'FULL_TIME',
        employmentStatus: 'ACTIVE',
        positionId: seniorEngineer.id,
        departmentId: engineering.id,
        managerId: adminEmployee.id,
        address: 'Thu Duc City, Ho Chi Minh City',
      },
    }),
    prisma.employee.create({
      data: {
        employeeNumber: 'EMP004',
        firstName: 'Linh',
        lastName: 'Vo',
        email: 'linh.vo@hrm.com',
        workEmail: 'linh.vo@hrm.com',
        phone: '+84 900 000 004',
        dateOfBirth: date('1996-11-02'),
        gender: 'FEMALE',
        hireDate: date('2023-01-16'),
        confirmationDate: date('2023-04-16'),
        employmentType: 'FULL_TIME',
        employmentStatus: 'ACTIVE',
        positionId: softwareEngineer.id,
        departmentId: engineering.id,
        managerId: adminEmployee.id,
        address: 'District 7, Ho Chi Minh City',
      },
    }),
    prisma.employee.create({
      data: {
        employeeNumber: 'EMP005',
        firstName: 'Huy',
        lastName: 'Le',
        email: 'huy.le@hrm.com',
        workEmail: 'huy.le@hrm.com',
        phone: '+84 900 000 005',
        dateOfBirth: date('1992-07-18'),
        gender: 'MALE',
        hireDate: date('2021-08-02'),
        confirmationDate: date('2021-11-02'),
        employmentType: 'FULL_TIME',
        employmentStatus: 'ACTIVE',
        positionId: accountant.id,
        departmentId: finance.id,
        address: 'District 3, Ho Chi Minh City',
      },
    }),
    prisma.employee.create({
      data: {
        employeeNumber: 'EMP006',
        firstName: 'An',
        lastName: 'Nguyen',
        email: 'an.nguyen@hrm.com',
        workEmail: 'an.nguyen@hrm.com',
        phone: '+84 900 000 006',
        dateOfBirth: date('1993-12-08'),
        gender: 'FEMALE',
        hireDate: date('2022-03-14'),
        confirmationDate: date('2022-06-14'),
        employmentType: 'FULL_TIME',
        employmentStatus: 'ACTIVE',
        positionId: productManager.id,
        departmentId: product.id,
        address: 'Phu Nhuan District, Ho Chi Minh City',
      },
    }),
  ]);

  // ---------------------------------------------------------------------------
  // 5. Department heads
  // ---------------------------------------------------------------------------
  await prisma.department.update({
    where: { id: engineering.id },
    data: { headId: adminEmployee.id },
  });

  await prisma.department.update({
    where: { id: humanResources.id },
    data: { headId: hrEmployee.id },
  });

  // ---------------------------------------------------------------------------
  // 6. Bank accounts
  // ---------------------------------------------------------------------------
  const allEmployees = [adminEmployee, hrEmployee, ...employees];

  for (const [index, employee] of allEmployees.entries()) {
    await prisma.bankAccount.create({
      data: {
        employeeId: employee.id,
        accountName: `${employee.firstName} ${employee.lastName}`,
        accountNumber: `01234567${String(index + 1).padStart(2, '0')}`,
        currency: 'VND',
      },
    });
  }

  // ---------------------------------------------------------------------------
  // 7. Leave types & balances
  // ---------------------------------------------------------------------------
  const annualLeave = await prisma.leaveType.create({
    data: {
      name: 'Annual Leave',
      category: 'ANNUAL',
      isPaid: true,
      requiresApproval: true,
    },
  });

  const sickLeave = await prisma.leaveType.create({
    data: {
      name: 'Sick Leave',
      category: 'SICK',
      isPaid: true,
      requiresApproval: true,
    },
  });

  const unpaidLeave = await prisma.leaveType.create({
    data: {
      name: 'Unpaid Leave',
      category: 'UNPAID',
      isPaid: false,
      requiresApproval: true,
    },
  });

  const currentYear = new Date().getFullYear();

  for (const employee of allEmployees) {
    await prisma.leaveBalance.createMany({
      data: [
        {
          employeeId: employee.id,
          leaveTypeId: annualLeave.id,
          year: currentYear,
          entitled: d('12'),
          used: d('2'),
          pending: d('1'),
          carriedOver: d('1'),
        },
        {
          employeeId: employee.id,
          leaveTypeId: sickLeave.id,
          year: currentYear,
          entitled: d('10'),
          used: d('1'),
          pending: d('0'),
          carriedOver: d('0'),
        },
        {
          employeeId: employee.id,
          leaveTypeId: unpaidLeave.id,
          year: currentYear,
          entitled: d('5'),
          used: d('0'),
          pending: d('0'),
          carriedOver: d('0'),
        },
      ],
      skipDuplicates: true,
    });
  }

  // ---------------------------------------------------------------------------
  // 8. Leave requests
  // ---------------------------------------------------------------------------
  await prisma.leaveRequest.createMany({
    data: [
      {
        employeeId: employees[0].id,
        leaveTypeId: annualLeave.id,
        startDate: date(`${currentYear}-06-15T00:00:00+07:00`),
        endDate: date(`${currentYear}-06-16T00:00:00+07:00`),
        totalDays: d('2'),
        reason: 'Family trip',
        status: 'APPROVED',
        approverId: adminEmployee.id,
        approvedAt: date(`${currentYear}-06-01T10:00:00+07:00`),
      },
      {
        employeeId: employees[1].id,
        leaveTypeId: sickLeave.id,
        startDate: date(`${currentYear}-08-25T00:00:00+07:00`),
        endDate: date(`${currentYear}-08-25T00:00:00+07:00`),
        totalDays: d('1'),
        reason: 'Medical appointment',
        status: 'PENDING',
        approverId: adminEmployee.id,
      },
      {
        employeeId: employees[2].id,
        leaveTypeId: annualLeave.id,
        startDate: date(`${currentYear}-07-10T00:00:00+07:00`),
        endDate: date(`${currentYear}-07-11T00:00:00+07:00`),
        totalDays: d('2'),
        reason: 'Personal travel',
        status: 'REJECTED',
        approverId: hrEmployee.id,
        rejectedAt: date(`${currentYear}-07-01T10:00:00+07:00`),
        rejectionReason: 'Insufficient team coverage',
      },
    ],
  });

  // ---------------------------------------------------------------------------
  // 9. Public holidays
  // ---------------------------------------------------------------------------
  await prisma.publicHoliday.createMany({
    data: [
      {
        name: "New Year's Day",
        date: date(`${currentYear}-01-01T00:00:00+07:00`),
      },
      {
        name: 'Independence Day',
        date: date(`${currentYear}-09-02T00:00:00+07:00`),
      },
      {
        name: 'Christmas Day',
        date: date(`${currentYear}-12-25T00:00:00+07:00`),
      },
    ],
    skipDuplicates: true,
  });

  // ---------------------------------------------------------------------------
  // 10. Shifts & schedules
  // ---------------------------------------------------------------------------
  const standardShift = await prisma.shift.create({
    data: {
      name: 'Standard Office',
      startTime: '08:30',
      endTime: '17:30',
      breakMins: 60,
    },
  });

  const flexibleShift = await prisma.shift.create({
    data: {
      name: 'Flexible',
      startTime: '09:00',
      endTime: '18:00',
      breakMins: 60,
    },
  });

  for (const employee of allEmployees) {
    await prisma.shiftSchedule.create({
      data: {
        shiftId:
          employee.id === employees[1].id ? flexibleShift.id : standardShift.id,
        employeeId: employee.id,
        startDate: date(`${currentYear}-01-01T00:00:00+07:00`),
      },
    });
  }

  // ---------------------------------------------------------------------------
  // 11. Attendance
  // ---------------------------------------------------------------------------
  const attendanceDates = [
    `${currentYear}-08-26`,
    `${currentYear}-08-27`,
    `${currentYear}-08-28`,
  ];

  for (const day of attendanceDates) {
    for (const [index, employee] of allEmployees.entries()) {
      const checkInHour = index === 2 && day.endsWith('27') ? 9 : 8;
      const checkInMinute = index === 2 && day.endsWith('27') ? 15 : 30;

      await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          date: date(`${day}T00:00:00+07:00`),
          checkIn: date(
            `${day}T${String(checkInHour).padStart(2, '0')}:${String(checkInMinute).padStart(2, '0')}:00+07:00`,
          ),
          checkOut: date(`${day}T17:30:00+07:00`),
          hoursWorked: d(checkInHour === 9 ? '7.25' : '8'),
          overtimeHours: d(day.endsWith('28') && index === 0 ? '1.5' : '0'),
          status: checkInHour === 9 ? 'LATE' : 'PRESENT',
          source: 'WEB',
        },
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 12. Assets & assignments
  // ---------------------------------------------------------------------------
  const laptop1 = await prisma.asset.create({
    data: {
      name: 'MacBook Pro 14',
      category: 'LAPTOP',
      serialNumber: 'MBP-EXAMPLE-001',
      brand: 'Apple',
      model: 'MacBook Pro 14-inch',
      purchaseDate: date('2025-01-15'),
      purchaseCost: d('55000000'),
      status: 'ASSIGNED',
    },
  });

  const laptop2 = await prisma.asset.create({
    data: {
      name: 'ThinkPad X1 Carbon',
      category: 'LAPTOP',
      serialNumber: 'TP-EXAMPLE-001',
      brand: 'Lenovo',
      model: 'X1 Carbon',
      purchaseDate: date('2024-09-10'),
      purchaseCost: d('42000000'),
      status: 'ASSIGNED',
    },
  });

  await prisma.asset.create({
    data: {
      name: 'Dell UltraSharp Monitor',
      category: 'MONITOR',
      serialNumber: 'DELL-EXAMPLE-001',
      brand: 'Dell',
      model: 'U2723QE',
      purchaseDate: date('2025-03-20'),
      purchaseCost: d('15000000'),
      status: 'AVAILABLE',
    },
  });

  await prisma.assetAssignment.createMany({
    data: [
      {
        assetId: laptop1.id,
        employeeId: employees[0].id,
        assignedAt: date('2025-02-01T09:00:00+07:00'),
        condition: 'Good',
      },
      {
        assetId: laptop2.id,
        employeeId: employees[1].id,
        assignedAt: date('2025-02-15T09:00:00+07:00'),
        condition: 'Good',
      },
    ],
  });

  // ---------------------------------------------------------------------------
  // 13. Compensation
  // ---------------------------------------------------------------------------
  const compensationByEmployee = [
    [adminEmployee, '65000000', engineering, engineeringManager],
    [hrEmployee, '40000000', humanResources, hrManagerPosition],
    [employees[0], '45000000', engineering, seniorEngineer],
    [employees[1], '28000000', engineering, softwareEngineer],
    [employees[2], '26000000', finance, accountant],
    [employees[3], '42000000', product, productManager],
  ] as const;

  const compensationMap = new Map<string, string>();

  for (const [employee, salary] of compensationByEmployee) {
    const compensation = await prisma.employeeCompensation.create({
      data: {
        employeeId: employee.id,
        effectiveFrom: date('2026-01-01T00:00:00+07:00'),
        currency: 'VND',
        baseSalary: d(salary),
        payType: 'SALARY',
        payFrequency: 'MONTHLY',
        allowances: {
          create: [
            {
              name: 'Meal Allowance',
              amount: d('1000000'),
              calculationType: 'FIXED',
              isTaxable: false,
              isRecurring: true,
            },
            {
              name: 'Transport Allowance',
              amount: d('500000'),
              calculationType: 'FIXED',
              isTaxable: false,
              isRecurring: true,
            },
          ],
        },
        deductions: {
          create: [
            {
              name: 'Social Insurance',
              calculationType: 'PERCENTAGE',
              rate: d('0.08'),
              isRecurring: true,
            },
          ],
        },
      },
    });

    compensationMap.set(employee.id, compensation.id);
  }

  // Salary history examples.
  await prisma.salaryHistory.createMany({
    data: [
      {
        employeeId: employees[0].id,
        oldSalary: d('40000000'),
        newSalary: d('45000000'),
        currency: 'VND',
        effectiveAt: date('2026-01-01T00:00:00+07:00'),
        reason: 'Annual salary review',
        approvedById: adminEmployee.id,
      },
      {
        employeeId: employees[1].id,
        oldSalary: d('25000000'),
        newSalary: d('28000000'),
        currency: 'VND',
        effectiveAt: date('2026-01-01T00:00:00+07:00'),
        reason: 'Promotion adjustment',
        approvedById: adminEmployee.id,
      },
    ],
  });

  // ---------------------------------------------------------------------------
  // 14. Payroll periods + payroll runs
  // ---------------------------------------------------------------------------

  const payrollPeriod = await prisma.payrollPeriod.create({
    data: {
      periodStart: date('2026-08-01'),
      periodEnd: date('2026-08-31'),
      payDate: date('2026-09-05'),
    },
  });

  // Get employees with their department and position.
  // Employee already stores departmentId and positionId,
  // so we don't need to duplicate those values in compensationByEmployee.

  const payrollEmployeeIds = compensationByEmployee.map(
    ([employee]) => employee.id,
  );

  const payrollEmployees = await prisma.employee.findMany({
    where: {
      id: {
        in: payrollEmployeeIds,
      },
    },
    include: {
      department: true,
      position: true,
    },
  });

  const payrollEmployeeMap = new Map(
    payrollEmployees.map((employee) => [employee.id, employee]),
  );

  // ---------------------------------------------------------------------------
  // Build payroll data
  // ---------------------------------------------------------------------------

  const payrollPreview = compensationByEmployee.map(([employee, salary]) => {
    const payrollEmployee = payrollEmployeeMap.get(employee.id);

    if (!payrollEmployee) {
      throw new Error(`Employee ${employee.employeeNumber} was not found`);
    }

    const baseSalary = d(salary);

    const mealAllowance = d('1000000');
    const transportAllowance = d('500000');

    const totalAllowance = mealAllowance.plus(transportAllowance);

    const grossPay = baseSalary.plus(totalAllowance);

    // 8% employee social insurance.
    const socialInsurance = baseSalary.mul(d('0.08'));

    // No PIT calculation yet.
    const totalTax = d('0');

    const totalDeduction = socialInsurance.plus(totalTax);

    const netPay = grossPay.minus(totalDeduction);

    return {
      employee: payrollEmployee,

      baseSalary,

      mealAllowance,
      transportAllowance,
      totalAllowance,

      grossPay,

      socialInsurance,

      totalTax,
      totalDeduction,

      netPay,
    };
  });

  // ---------------------------------------------------------------------------
  // Calculate payroll totals
  // ---------------------------------------------------------------------------

  const payrollTotals = payrollPreview.reduce(
    (total, item) => ({
      gross: total.gross.plus(item.grossPay),
      tax: total.tax.plus(item.totalTax),
      net: total.net.plus(item.netPay),
    }),
    {
      gross: d('0'),
      tax: d('0'),
      net: d('0'),
    },
  );

  // ---------------------------------------------------------------------------
  // Create payroll run
  // ---------------------------------------------------------------------------

  const payrollRun = await prisma.payrollRun.create({
    data: {
      payrollPeriodId: payrollPeriod.id,

      status: 'FINALIZED',

      totalGross: payrollTotals.gross,
      totalNet: payrollTotals.net,
      totalTax: payrollTotals.tax,

      notes: 'Seeded payroll run for August 2026',

      processedAt: date('2026-09-05T09:00:00+07:00'),

      processedById: adminEmployee.id,

      calculationVersion: 'v1',
    },
  });

  // ---------------------------------------------------------------------------
  // 15. Payroll calculations + payslips
  // ---------------------------------------------------------------------------

  for (const item of payrollPreview) {
    const employee = item.employee;

    // -------------------------------------------------------------------------
    // Payroll calculation
    // -------------------------------------------------------------------------

    const calculation = await prisma.payrollCalculation.create({
      data: {
        payrollRunId: payrollRun.id,

        employeeId: employee.id,

        baseSalary: item.baseSalary,

        // Earnings excluding base salary.
        totalEarnings: item.totalAllowance,

        grossPay: item.grossPay,

        preTaxDeductions: item.socialInsurance,

        taxableIncome: item.grossPay,

        totalTax: item.totalTax,

        postTaxDeductions: d('0'),

        netPay: item.netPay,

        // Store the calculation inputs/results
        // for auditing purposes.
        snapshot: {
          payrollPeriod: {
            start: '2026-08-01',
            end: '2026-08-31',
          },

          calculationVersion: 'v1',

          employee: {
            id: employee.id,
            employeeNumber: employee.employeeNumber,
            name: `${employee.firstName} ${employee.lastName}`,
          },

          department: employee.department
            ? {
                id: employee.department.id,
                name: employee.department.name,
              }
            : null,

          position: employee.position
            ? {
                id: employee.position.id,
                title: employee.position.title,
              }
            : null,

          baseSalary: item.baseSalary.toString(),

          allowances: {
            meal: item.mealAllowance.toString(),
            transport: item.transportAllowance.toString(),
            total: item.totalAllowance.toString(),
          },

          grossPay: item.grossPay.toString(),

          deductions: {
            socialInsuranceRate: '0.08',
            socialInsurance: item.socialInsurance.toString(),
          },

          tax: {
            totalTax: item.totalTax.toString(),
          },

          totalDeduction: item.totalDeduction.toString(),

          netPay: item.netPay.toString(),
        },
      },
    });

    // -------------------------------------------------------------------------
    // Payroll calculation items
    // -------------------------------------------------------------------------

    await prisma.payrollCalculationItem.createMany({
      data: [
        {
          calculationId: calculation.id,

          name: 'Base Salary',

          type: 'EARNING',

          amount: item.baseSalary,

          taxable: true,
        },

        {
          calculationId: calculation.id,

          name: 'Meal Allowance',

          type: 'EARNING',

          amount: item.mealAllowance,

          taxable: false,
        },

        {
          calculationId: calculation.id,

          name: 'Transport Allowance',

          type: 'EARNING',

          amount: item.transportAllowance,

          taxable: false,
        },

        {
          calculationId: calculation.id,

          name: 'Social Insurance',

          type: 'DEDUCTION',

          amount: item.socialInsurance,

          taxable: false,
        },

        {
          calculationId: calculation.id,

          name: 'Personal Income Tax',

          type: 'TAX',

          amount: item.totalTax,

          taxable: false,
        },
      ],
    });

    // -------------------------------------------------------------------------
    // Payslip
    // -------------------------------------------------------------------------

    const payslip = await prisma.payslip.create({
      data: {
        employeeId: employee.id,

        payrollRunId: payrollRun.id,

        // Snapshot employee information at payroll time.
        employeeNumberSnapshot: employee.employeeNumber,

        employeeNameSnapshot: `${employee.firstName} ${employee.lastName}`,

        // Employee already has departmentId/positionId,
        // and we loaded the actual relations above.
        departmentSnapshot: employee.department?.name ?? null,

        positionSnapshot: employee.position?.title ?? null,

        totalAllowance: item.totalAllowance,

        totalDeduction: item.totalDeduction,

        grossPay: item.grossPay,

        netPay: item.netPay,

        totalTax: item.totalTax,

        currency: 'VND',

        paidAt: date('2026-09-05T09:00:00+07:00'),
      },
    });

    // -------------------------------------------------------------------------
    // Payslip line items
    // -------------------------------------------------------------------------

    await prisma.payslipLineItem.createMany({
      data: [
        {
          payslipId: payslip.id,

          name: 'Base Salary',

          type: 'EARNING',

          amount: item.baseSalary,

          taxable: true,
        },

        {
          payslipId: payslip.id,

          name: 'Meal Allowance',

          type: 'EARNING',

          amount: item.mealAllowance,

          taxable: false,
        },

        {
          payslipId: payslip.id,

          name: 'Transport Allowance',

          type: 'EARNING',

          amount: item.transportAllowance,

          taxable: false,
        },

        {
          payslipId: payslip.id,

          name: 'Social Insurance',

          type: 'DEDUCTION',

          amount: item.socialInsurance,

          taxable: false,
        },

        {
          payslipId: payslip.id,

          name: 'Personal Income Tax',

          type: 'TAX',

          amount: item.totalTax,

          taxable: false,
        },
      ],
    });
  }

  // ---------------------------------------------------------------------------
  // Payroll seed summary
  // ---------------------------------------------------------------------------

  console.log('✅ Payroll seed completed');

  console.log({
    payrollPeriodId: payrollPeriod.id,

    payrollRunId: payrollRun.id,

    employeeCount: payrollPreview.length,

    totalGross: payrollTotals.gross.toString(),

    totalTax: payrollTotals.tax.toString(),

    totalNet: payrollTotals.net.toString(),
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed thất bại:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
