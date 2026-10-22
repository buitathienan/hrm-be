import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from './env.validation';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { LeaveModule } from './leaves/leaves.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SalaryComponentModule } from './salary-component/salary-component.module';
import { SalaryStructureModule } from './salary-structure/salary-structure.module';
import { SalaryStructureAssignmentModule } from './salary-structure-assignment/salary-structure-assignment.module';
import { PayrollPeriodModule } from './payroll-period/payroll-period.module';
import { PayslipModule } from './payslips/payslip.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidation }),
    DepartmentsModule,
    EmployeesModule,
    LeaveModule,
    AuthModule,
    AttendanceModule,
    SalaryComponentModule,
    SalaryStructureModule,
    SalaryStructureAssignmentModule,
    PayrollPeriodModule,
    PayslipModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
