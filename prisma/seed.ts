import { PrismaPg } from '@prisma/adapter-pg';

import bcrypt from 'bcrypt';
import {
  AttendanceStatus,
  EmploymentStatus,
  EmploymentType,
  Gender,
  LeaveStatus,
  PayrollPeriodStatus,
  PayslipItemType,
  PrismaClient,
  SalaryComponentCalculationType,
  SalaryComponentType,
} from 'src/generated/prisma/client';

const decimal = (value: number) => value.toFixed(2);
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Permission
  const permissionData = [
    ['employee', 'create'],
    ['employee', 'update'],
    ['employee', 'read'],
    ['employee', 'delete'],

    ['department', 'create'],
    ['department', 'read'],
    ['department', 'update'],
    ['department', 'delete'],

    //Leave
    ['leave', 'create'],
    ['leave', 'read'],
    ['leave', 'update'],
    ['leave', 'approve'],
    ['leave', 'delete'],

    // Attendance
    ['attendance', 'create'],
    ['attendance', 'read'],
    ['attendance', 'update'],
    ['attendance', 'delete'],
    // Salary
    ['salary', 'create'],
    ['salary', 'read'],
    ['salary', 'update'],
    ['salary', 'delete'],

    // Payroll
    ['payroll', 'create'],
    ['payroll', 'read'],
    ['payroll', 'calculate'],
    ['payroll', 'approve'],
    ['payroll', 'finalize'],

    //User
    ['user', 'create'],
    ['user', 'read'],
    ['user', 'update'],
    ['user', 'delete'],
  ];

  const permissions: Record<string, { id: number }> = {};

  for (const [resource, action] of permissionData) {
    const permission = await prisma.permission.upsert({
      where: {
        resource_action: {
          resource,
          action,
        },
      },
      update: {},
      create: {
        resource,
        action,
        description: `${action} ${resource}`,
      },
    });

    permissions[`${resource}:${action}`] = permission;
  }

  console.log(`Created ${permissionData.length}`);

  // 2. Role
  const adminRole = await prisma.role.upsert({
    where: {
      name: 'ADMIN',
    },
    update: {},
    create: {
      name: 'ADMIN',
    },
  });

  const hrRole = await prisma.role.upsert({
    where: {
      name: 'HR',
    },
    update: {},
    create: {
      name: 'HR',
    },
  });

  const employeeRole = await prisma.role.upsert({
    where: {
      name: 'EMPLOYEE',
    },
    update: {},
    create: {
      name: 'EMPLOYEE',
    },
  });

  // 3. RolePermission
  const allPermissionKeys = Object.keys(permissions);

  const hrPermissionKeys = [
    'employee:create',
    'employee:read',
    'employee:update',
    'department:read',
    'department:create',
    'department:update',
    'leave:create',
    'leave:read',
    'leave:update',
    'leave:approve',
    'attendance:read',
    'attendance:update',
    'salary:read',
    'salary:create',
    'salary:update',
  ];

  //   const payrollPermissionKeys = [
  //     'employee:read',
  //     'department:read',
  //     'attendance:read',
  //     'salary:read',
  //     'payroll:create',
  //     'payroll:read',
  //     'payroll:calculate',
  //     'payroll:approve',
  //     'payroll:finalize',
  //   ];
  const employeePermissionKeys = [
    'employee:read',
    'leave:create',
    'leave:read',
    'attendance:read',
    'salary:read',
    'payroll:read',
  ];

  const assignPermissions = async (
    roleId: number,
    permissionKeys: string[],
  ) => {
    for (const key of permissionKeys) {
      const permission = permissions[key];

      if (!permission) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId,
          permissionId: permission.id,
        },
      });
    }
  };

  await assignPermissions(adminRole.id, allPermissionKeys);
  await assignPermissions(hrRole.id, hrPermissionKeys);
  await assignPermissions(employeeRole.id, employeePermissionKeys);

  console.log('✓ Role permissions created');

  // 4. Department
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
      description: 'Human resources and employee relations',
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
  const sales = await prisma.department.upsert({
    where: { code: 'SAL' },
    update: {},
    create: {
      name: 'Sales',
      code: 'SAL',
      description: 'Sales and business development',
    },
  });

  console.log('✓ Departments created');

  // 5. Employee
  const ceo = await prisma.employee.upsert({
    where: { code: 'EMP001' },
    update: {},
    create: {
      code: 'EMP001',
      firstName: 'Minh',
      lastName: 'Nguyen',
      gender: Gender.MALE,
      email: 'minh.nguyen@example.com',
      phone: '0901000001',
      hireDate: new Date('2020-01-06'),
      confirmationDate: new Date('2020-04-06'),
      departmentId: engineering.id,
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
  });
  const hrManager = await prisma.employee.upsert({
    where: { code: 'EMP002' },
    update: {},
    create: {
      code: 'EMP002',
      firstName: 'Lan',
      lastName: 'Tran',
      gender: Gender.FEMALE,
      email: 'lan.tran@example.com',
      phone: '0901000002',
      hireDate: new Date('2021-02-01'),
      confirmationDate: new Date('2021-05-01'),
      departmentId: humanResources.id,
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
  });

  const financeManager = await prisma.employee.upsert({
    where: { code: 'EMP003' },
    update: {},
    create: {
      code: 'EMP003',
      firstName: 'Huy',
      lastName: 'Pham',
      gender: Gender.MALE,
      email: 'huy.pham@example.com',
      phone: '0901000003',
      hireDate: new Date('2021-03-15'),
      confirmationDate: new Date('2021-06-15'),
      departmentId: finance.id,
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
  });
  const salesManager = await prisma.employee.upsert({
    where: { code: 'EMP004' },
    update: {},
    create: {
      code: 'EMP004',
      firstName: 'Thao',
      lastName: 'Le',
      gender: Gender.FEMALE,
      email: 'thao.le@example.com',
      phone: '0901000004',
      hireDate: new Date('2022-01-10'),
      confirmationDate: new Date('2022-04-10'),
      departmentId: sales.id,
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
  });
  // Subordinates
  const backendDev = await prisma.employee.upsert({
    where: { code: 'EMP005' },
    update: {},
    create: {
      code: 'EMP005',
      firstName: 'An',
      lastName: 'Vo',
      gender: Gender.MALE,
      email: 'an.vo@example.com',
      phone: '0901000005',
      hireDate: new Date('2023-02-01'),
      confirmationDate: new Date('2023-05-01'),
      departmentId: engineering.id,
      managerId: ceo.id,
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
  });
  const frontendDev = await prisma.employee.upsert({
    where: { code: 'EMP006' },
    update: {},
    create: {
      code: 'EMP006',
      firstName: 'Mai',
      lastName: 'Nguyen',
      gender: Gender.FEMALE,
      email: 'mai.nguyen@example.com',
      phone: '0901000006',
      hireDate: new Date('2023-06-01'),
      confirmationDate: new Date('2023-09-01'),
      departmentId: engineering.id,
      managerId: ceo.id,
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
  });
  const hrStaff = await prisma.employee.upsert({
    where: { code: 'EMP007' },
    update: {},
    create: {
      code: 'EMP007',
      firstName: 'Linh',
      lastName: 'Do',
      gender: Gender.FEMALE,
      email: 'linh.do@example.com',
      phone: '0901000007',
      hireDate: new Date('2024-01-15'),
      confirmationDate: new Date('2024-04-15'),
      departmentId: humanResources.id,
      managerId: hrManager.id,
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
  });
  const accountant = await prisma.employee.upsert({
    where: { code: 'EMP008' },
    update: {},
    create: {
      code: 'EMP008',
      firstName: 'Duc',
      lastName: 'Bui',
      gender: Gender.MALE,
      email: 'duc.bui@example.com',
      phone: '0901000008',
      hireDate: new Date('2023-09-01'),
      confirmationDate: new Date('2023-12-01'),
      departmentId: finance.id,
      managerId: financeManager.id,
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
  });
  const salesStaff = await prisma.employee.upsert({
    where: { code: 'EMP009' },
    update: {},
    create: {
      code: 'EMP009',
      firstName: 'Khanh',
      lastName: 'Pham',
      gender: Gender.FEMALE,
      email: 'khanh.pham@example.com',
      phone: '0901000009',
      hireDate: new Date('2024-03-01'),
      confirmationDate: new Date('2024-06-01'),
      departmentId: sales.id,
      managerId: salesManager.id,
      employmentType: EmploymentType.FULL_TIME,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
  });
  const intern = await prisma.employee.upsert({
    where: { code: 'EMP010' },
    update: {},
    create: {
      code: 'EMP010',
      firstName: 'Nam',
      lastName: 'Ho',
      gender: Gender.MALE,
      email: 'nam.ho@example.com',
      phone: '0901000010',
      hireDate: new Date('2026-07-01'),
      probationEnd: new Date('2026-09-30'),
      departmentId: engineering.id,
      managerId: ceo.id,
      employmentType: EmploymentType.INTERN,
      employmentStatus: EmploymentStatus.ACTIVE,
    },
  });

  console.log('✓ Employees created');

  // 6. User
  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'minh.nguyen@example.com' },
    update: { roleId: adminRole.id, password: passwordHash },
    create: {
      email: 'minh.nguyen@example.com',
      password: passwordHash,
      employeeId: ceo.id,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'lan.tran@example.com' },
    update: { roleId: hrRole.id, password: passwordHash },
    create: {
      email: 'lan.tran@example.com',
      password: passwordHash,
      employeeId: hrManager.id,
      roleId: hrRole.id,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'an.vo@example.com' },
    update: { roleId: employeeRole.id, password: passwordHash },
    create: {
      email: 'an.vo@example.com',
      password: passwordHash,
      employeeId: backendDev.id,
      roleId: employeeRole.id,
      isActive: true,
    },
  });

  console.log('✓ Users created');

  const annualLeave = await prisma.leaveType.upsert({
    where: { code: 'ANNUAL' },
    update: {},
    create: {
      name: 'Annual Leave',
      code: 'ANNUAL',
      description: 'Paid annual leave',
      isActive: true,
    },
  });
  const sickLeave = await prisma.leaveType.upsert({
    where: { code: 'SICK' },
    update: {},
    create: {
      name: 'Sick Leave',
      code: 'SICK',
      description: 'Leave due to sickness',
      isActive: true,
    },
  });
  const unpaidLeave = await prisma.leaveType.upsert({
    where: { code: 'UNPAID' },
    update: {},
    create: {
      name: 'Unpaid Leave',
      code: 'UNPAID',
      description: 'Unpaid personal leave',
      isActive: true,
    },
  });
  const maternityLeave = await prisma.leaveType.upsert({
    where: { code: 'MATERNITY' },
    update: {},
    create: {
      name: 'Maternity Leave',
      code: 'MATERNITY',
      description: 'Maternity leave',
      isActive: true,
    },
  });

  // 8. Leave request
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveRequest.createMany({
    data: [
      {
        employeeId: backendDev.id,
        leaveTypeId: annualLeave.id,
        startDate: new Date('2026-08-10'),
        endDate: new Date('2026-08-12'),
        reason: 'Family trip',
        status: LeaveStatus.APPROVED,
      },
      {
        employeeId: frontendDev.id,
        leaveTypeId: sickLeave.id,
        startDate: new Date('2026-08-20'),
        endDate: new Date('2026-08-20'),
        reason: 'Feeling unwell',
        status: LeaveStatus.APPROVED,
      },
      {
        employeeId: hrStaff.id,
        leaveTypeId: annualLeave.id,
        startDate: new Date('2026-09-28'),
        endDate: new Date('2026-09-30'),
        reason: 'Personal vacation',
        status: LeaveStatus.PENDING,
      },
      {
        employeeId: accountant.id,
        leaveTypeId: unpaidLeave.id,
        startDate: new Date('2026-08-05'),
        endDate: new Date('2026-08-06'),
        reason: 'Personal matters',
        status: LeaveStatus.REJECTED,
      },
      {
        employeeId: salesStaff.id,
        leaveTypeId: annualLeave.id,
        startDate: new Date('2026-07-15'),
        endDate: new Date('2026-07-16'),
        reason: 'Travel',
        status: LeaveStatus.CANCELLED,
      },
      {
        employeeId: salesStaff.id,
        leaveTypeId: maternityLeave.id,
        startDate: new Date('2026-10-01'),
        endDate: new Date('2026-12-31'),
        reason: 'Maternity leave',
        status: LeaveStatus.PENDING,
      },
    ],
  });
  console.log('✓ Leave data created');

  // 9. Attendance
  await prisma.attendance.deleteMany();
  const attendanceEmployees = [
    backendDev,
    frontendDev,
    hrStaff,
    accountant,
    salesStaff,
    intern,
  ];
  const attendanceDates = [
    '2026-09-21',
    '2026-09-22',
    '2026-09-23',
    '2026-09-24',
    '2026-09-25',
  ];
  for (const employee of attendanceEmployees) {
    for (const dateString of attendanceDates) {
      const date = new Date(`${dateString}T00:00:00`);
      let status: AttendanceStatus = AttendanceStatus.PRESENT;
      let checkIn: Date | null = new Date(`${dateString}T08:30:00`);
      let checkOut: Date | null = new Date(`${dateString}T17:30:00`);
      if (employee.code === 'EMP005' && dateString === '2026-09-22') {
        status = AttendanceStatus.LATE;
        checkIn = new Date(`${dateString}T09:20:00`);
      }
      if (employee.code === 'EMP006' && dateString === '2026-09-23') {
        status = AttendanceStatus.HALF_DAY;
        checkOut = new Date(`${dateString}T12:00:00`);
      }
      if (employee.code === 'EMP007' && dateString === '2026-09-24') {
        status = AttendanceStatus.ABSENT;
        checkIn = null;
        checkOut = null;
      }
      await prisma.attendance.create({
        data: { employeeId: employee.id, date, checkIn, checkOut, status },
      });
    }
  }
  console.log('✓ Attendance data created');

  // 10. Salary component
  const baseSalary = await prisma.salaryComponent.upsert({
    where: { code: 'BASE' },
    update: {},
    create: {
      name: 'Base Salary',
      code: 'BASE',
      description: 'Employee base salary',
      type: SalaryComponentType.ALLOWANCE,
      isActive: true,
    },
  });
  const lunchAllowance = await prisma.salaryComponent.upsert({
    where: { code: 'LUNCH' },
    update: {},
    create: {
      name: 'Lunch Allowance',
      code: 'LUNCH',
      description: 'Monthly lunch allowance',
      type: SalaryComponentType.ALLOWANCE,
      isActive: true,
    },
  });
  const transportAllowance = await prisma.salaryComponent.upsert({
    where: { code: 'TRANSPORT' },
    update: {},
    create: {
      name: 'Transport Allowance',
      code: 'TRANSPORT',
      description: 'Monthly transportation allowance',
      type: SalaryComponentType.ALLOWANCE,
      isActive: true,
    },
  });
  const phoneAllowance = await prisma.salaryComponent.upsert({
    where: { code: 'PHONE' },
    update: {},
    create: {
      name: 'Phone Allowance',
      code: 'PHONE',
      description: 'Monthly phone allowance',
      type: SalaryComponentType.ALLOWANCE,
      isActive: true,
    },
  });
  const insurance = await prisma.salaryComponent.upsert({
    where: { code: 'INSURANCE' },
    update: {},
    create: {
      name: 'Social Insurance',
      code: 'INSURANCE',
      description: 'Employee insurance deduction',
      type: SalaryComponentType.DEDUCTION,
      isActive: true,
    },
  });
  const tax = await prisma.salaryComponent.upsert({
    where: { code: 'TAX' },
    update: {},
    create: {
      name: 'Personal Income Tax',
      code: 'TAX',
      description: 'Personal income tax',
      type: SalaryComponentType.DEDUCTION,
      isActive: true,
    },
  });
  const overtime = await prisma.salaryComponent.upsert({
    where: { code: 'OVERTIME' },
    update: {},
    create: {
      name: 'Overtime',
      code: 'OVERTIME',
      description: 'Overtime payment',
      type: SalaryComponentType.ALLOWANCE,
      isActive: true,
    },
  });
  const bonus = await prisma.salaryComponent.upsert({
    where: { code: 'BONUS' },
    update: {},
    create: {
      name: 'Performance Bonus',
      code: 'BONUS',
      description: 'Performance-based bonus',
      type: SalaryComponentType.ALLOWANCE,
      isActive: true,
    },
  });
  console.log('✓ Salary components created');

  // 11. Salary structures

  const standardStructure = await prisma.salaryStructure.upsert({
    where: { code: 'STANDARD' },
    update: {},
    create: {
      name: 'Standard Employee',
      code: 'STANDARD',
      description: 'Standard full-time employee salary structure',
    },
  });
  const managerStructure = await prisma.salaryStructure.upsert({
    where: { code: 'MANAGER' },
    update: {},
    create: {
      name: 'Manager',
      code: 'MANAGER',
      description: 'Management salary structure',
    },
  });
  const internStructure = await prisma.salaryStructure.upsert({
    where: { code: 'INTERN' },
    update: {},
    create: {
      name: 'Intern',
      code: 'INTERN',
      description: 'Intern salary structure',
    },
  });

  // 12. Salary structure component
  await prisma.salaryStructureComponent.deleteMany();
  await prisma.salaryStructureComponent.createMany({
    data: [
      // STANDARD
      {
        salaryStructureId: standardStructure.id,
        salaryComponentId: baseSalary.id,
        sortOrder: 1,
        value: null,
        calculationType: SalaryComponentCalculationType.BASE_SALARY,
      },
      {
        salaryStructureId: standardStructure.id,
        salaryComponentId: lunchAllowance.id,
        sortOrder: 2,
        value: decimal(1000000),
        calculationType: SalaryComponentCalculationType.FIXED,
      },
      {
        salaryStructureId: standardStructure.id,
        salaryComponentId: transportAllowance.id,
        sortOrder: 3,
        value: decimal(500000),
        calculationType: SalaryComponentCalculationType.FIXED,
      },
      {
        salaryStructureId: standardStructure.id,
        salaryComponentId: phoneAllowance.id,
        sortOrder: 4,
        value: decimal(300000),
        calculationType: SalaryComponentCalculationType.FIXED,
      },
      {
        salaryStructureId: standardStructure.id,
        salaryComponentId: insurance.id,
        sortOrder: 5,
        value: decimal(10.5),
        calculationType: SalaryComponentCalculationType.PERCENTAGE,
      },
      // MANAGER
      {
        salaryStructureId: managerStructure.id,
        salaryComponentId: baseSalary.id,
        sortOrder: 1,
        value: null,
        calculationType: SalaryComponentCalculationType.BASE_SALARY,
      },
      {
        salaryStructureId: managerStructure.id,
        salaryComponentId: lunchAllowance.id,
        sortOrder: 2,
        value: decimal(1500000),
        calculationType: SalaryComponentCalculationType.FIXED,
      },
      {
        salaryStructureId: managerStructure.id,
        salaryComponentId: transportAllowance.id,
        sortOrder: 3,
        value: decimal(800000),
        calculationType: SalaryComponentCalculationType.FIXED,
      },
      {
        salaryStructureId: managerStructure.id,
        salaryComponentId: phoneAllowance.id,
        sortOrder: 4,
        value: decimal(500000),
        calculationType: SalaryComponentCalculationType.FIXED,
      },
      {
        salaryStructureId: managerStructure.id,
        salaryComponentId: insurance.id,
        sortOrder: 5,
        value: decimal(10.5),
        calculationType: SalaryComponentCalculationType.PERCENTAGE,
      },
      {
        salaryStructureId: managerStructure.id,
        salaryComponentId: bonus.id,
        sortOrder: 6,
        value: decimal(10),
        calculationType: SalaryComponentCalculationType.PERCENTAGE,
      },
      // INTERN
      {
        salaryStructureId: internStructure.id,
        salaryComponentId: baseSalary.id,
        sortOrder: 1,
        value: null,
        calculationType: SalaryComponentCalculationType.BASE_SALARY,
      },
      {
        salaryStructureId: internStructure.id,
        salaryComponentId: lunchAllowance.id,
        sortOrder: 2,
        value: decimal(500000),
        calculationType: SalaryComponentCalculationType.FIXED,
      },
      {
        salaryStructureId: internStructure.id,
        salaryComponentId: transportAllowance.id,
        sortOrder: 3,
        value: decimal(300000),
        calculationType: SalaryComponentCalculationType.FIXED,
      },
    ],
  });
  console.log('✓ Salary structures created');

  // 13. Salary assignment
  await prisma.salaryStructureAssignment.deleteMany();

  const assignments = [
    {
      employeeId: ceo.id,
      salaryStructureId: managerStructure.id,
      baseSalary: 45000000,
      fromDate: '2026-01-01',
    },
    {
      employeeId: hrManager.id,
      salaryStructureId: managerStructure.id,
      baseSalary: 30000000,
      fromDate: '2026-01-01',
    },
    {
      employeeId: financeManager.id,
      salaryStructureId: managerStructure.id,
      baseSalary: 32000000,
      fromDate: '2026-01-01',
    },
    {
      employeeId: salesManager.id,
      salaryStructureId: managerStructure.id,
      baseSalary: 30000000,
      fromDate: '2026-01-01',
    },
    {
      employeeId: backendDev.id,
      salaryStructureId: standardStructure.id,
      baseSalary: 25000000,
      fromDate: '2026-01-01',
    },
    {
      employeeId: frontendDev.id,
      salaryStructureId: standardStructure.id,
      baseSalary: 23000000,
      fromDate: '2026-01-01',
    },
    {
      employeeId: hrStaff.id,
      salaryStructureId: standardStructure.id,
      baseSalary: 18000000,
      fromDate: '2026-01-01',
    },
    {
      employeeId: accountant.id,
      salaryStructureId: standardStructure.id,
      baseSalary: 20000000,
      fromDate: '2026-01-01',
    },
    {
      employeeId: salesStaff.id,
      salaryStructureId: standardStructure.id,
      baseSalary: 19000000,
      fromDate: '2026-01-01',
    },
    {
      employeeId: intern.id,
      salaryStructureId: internStructure.id,
      baseSalary: 7000000,
      fromDate: '2026-07-01',
    },
  ];

  for (const assignment of assignments) {
    await prisma.salaryStructureAssignment.create({
      data: {
        employeeId: assignment.employeeId,
        salaryStructureId: assignment.salaryStructureId,
        baseSalary: decimal(assignment.baseSalary),
        fromDate: new Date(assignment.fromDate),
      },
    });
  }
  console.log('✓ Salary assignments created');

  // 14. Payroll periods

  const payrollPeriodAugust = await prisma.payrollPeriod.upsert({
    where: {
      startDate_endDate: {
        startDate: new Date('2026-08-01'),
        endDate: new Date('2026-08-31'),
      },
    },
    update: {},
    create: {
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-08-31'),
      status: PayrollPeriodStatus.FINALIZED,
      notes: 'August 2026 payroll',
      processedAt: new Date('2026-09-03T10:00:00'),
      processById: financeManager.id
        ? (
            await prisma.user.findUnique({
              where: { email: 'huy.pham@example.com' },
            })
          )?.id
        : null,
    },
  });
  const payrollPeriodSeptember = await prisma.payrollPeriod.upsert({
    where: {
      startDate_endDate: {
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-30'),
      },
    },
    update: {},
    create: {
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-30'),
      status: PayrollPeriodStatus.CALCULATED,
      notes: 'September 2026 payroll',
      processedAt: new Date('2026-09-27T10:00:00'),
      processById: (
        await prisma.user.findUnique({
          where: { email: 'huy.pham@example.com' },
        })
      )?.id,
    },
  });
  const payrollPeriodOctober = await prisma.payrollPeriod.upsert({
    where: {
      startDate_endDate: {
        startDate: new Date('2026-10-01'),
        endDate: new Date('2026-10-31'),
      },
    },
    update: {},
    create: {
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-10-31'),
      status: PayrollPeriodStatus.DRAFT,
      notes: 'October 2026 payroll',
    },
  });
  console.log('✓ Payroll periods created');

  // 15. Payslips
  await prisma.payslipItem.deleteMany();
  await prisma.payslip.deleteMany();
  const payrollEmployees = [
    {
      employee: backendDev,
      baseSalary: 25000000,
      allowance: 1800000,
      deduction: 2625000,
      tax: 1200000,
      bonus: 1500000,
    },
    {
      employee: frontendDev,
      baseSalary: 23000000,
      allowance: 1800000,
      deduction: 2415000,
      tax: 900000,
      bonus: 1000000,
    },
    {
      employee: hrStaff,
      baseSalary: 18000000,
      allowance: 1800000,
      deduction: 1890000,
      tax: 500000,
      bonus: 500000,
    },
    {
      employee: accountant,
      baseSalary: 20000000,
      allowance: 1800000,
      deduction: 2100000,
      tax: 650000,
      bonus: 700000,
    },
    {
      employee: salesStaff,
      baseSalary: 19000000,
      allowance: 1800000,
      deduction: 1995000,
      tax: 600000,
      bonus: 1200000,
    },
  ];
  for (const item of payrollEmployees) {
    const gross = item.baseSalary + item.allowance + item.bonus;
    const totalDeduction = item.deduction + item.tax;
    const net = gross - totalDeduction;
    const payslip = await prisma.payslip.create({
      data: {
        employeeId: item.employee.id,
        payrollPeriodId: payrollPeriodAugust.id,
        employeeIdSnapshot: item.employee.id,
        employeeNameSnapshot: `${item.employee.firstName} ${item.employee.lastName}`,
        departmentSnapshot:
          item.employee.departmentId === engineering.id
            ? engineering.name
            : item.employee.departmentId === humanResources.id
              ? humanResources.name
              : item.employee.departmentId === finance.id
                ? finance.name
                : sales.name,
        totalAllowance: decimal(item.allowance + item.bonus),
        totalDeduction: decimal(totalDeduction),
        totalGross: decimal(gross),
        totalNet: decimal(net),
        totalTax: decimal(item.tax),
        currency: 'VND',
        paidAt: new Date('2026-09-05T10:00:00'),
      },
    });
    await prisma.payslipItem.createMany({
      data: [
        {
          payslipId: payslip.id,
          name: 'Base Salary',
          amount: decimal(item.baseSalary),
          type: PayslipItemType.ALLOWANCE,
        },
        {
          payslipId: payslip.id,
          name: 'Monthly Allowance',
          amount: decimal(item.allowance),
          type: PayslipItemType.ALLOWANCE,
        },
        {
          payslipId: payslip.id,
          name: 'Performance Bonus',
          amount: decimal(item.bonus),
          type: PayslipItemType.BONUS,
        },
        {
          payslipId: payslip.id,
          name: 'Social Insurance',
          amount: decimal(item.deduction),
          type: PayslipItemType.DEDUCTION,
        },
        {
          payslipId: payslip.id,
          name: 'Personal Income Tax',
          amount: decimal(item.tax),
          type: PayslipItemType.TAX,
        },
      ],
    });
  } // September payslips - currently calculated
  for (const item of payrollEmployees) {
    const gross = item.baseSalary + item.allowance;
    const totalDeduction = item.deduction + item.tax;
    const net = gross - totalDeduction;
    const payslip = await prisma.payslip.create({
      data: {
        employeeId: item.employee.id,
        payrollPeriodId: payrollPeriodSeptember.id,
        employeeIdSnapshot: item.employee.id,
        employeeNameSnapshot: `${item.employee.firstName} ${item.employee.lastName}`,
        departmentSnapshot:
          item.employee.departmentId === engineering.id
            ? engineering.name
            : item.employee.departmentId === humanResources.id
              ? humanResources.name
              : item.employee.departmentId === finance.id
                ? finance.name
                : sales.name,
        totalAllowance: decimal(item.allowance),
        totalDeduction: decimal(totalDeduction),
        totalGross: decimal(gross),
        totalNet: decimal(net),
        totalTax: decimal(item.tax),
        currency: 'VND',
      },
    });
    await prisma.payslipItem.createMany({
      data: [
        {
          payslipId: payslip.id,
          name: 'Base Salary',
          amount: decimal(item.baseSalary),
          type: PayslipItemType.ALLOWANCE,
        },
        {
          payslipId: payslip.id,
          name: 'Monthly Allowance',
          amount: decimal(item.allowance),
          type: PayslipItemType.ALLOWANCE,
        },
        {
          payslipId: payslip.id,
          name: 'Social Insurance',
          amount: decimal(item.deduction),
          type: PayslipItemType.DEDUCTION,
        },
        {
          payslipId: payslip.id,
          name: 'Personal Income Tax',
          amount: decimal(item.tax),
          type: PayslipItemType.TAX,
        },
      ],
    });
  }
  console.log('✓ Payslips and payslip items created');

  console.log('');
  console.log('========================================');
  console.log('🌱 Database seed completed successfully');
  console.log('========================================');
  console.log('');
  console.log('Test accounts:');
  console.log('----------------------------------------');
  console.log('Admin:');
  console.log(' email: minh.nguyen@example.com');
  console.log(' password: 123456');
  console.log('');
  console.log('HR:');
  console.log(' email: lan.tran@example.com');
  console.log(' password: 123456');
  console.log('');
  console.log('Employee:');
  console.log(' email: an.vo@example.com');
  console.log(' password: 123456');
  console.log('----------------------------------------');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
