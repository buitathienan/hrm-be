import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from './env.validation';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { LeaveModule } from './leaves/leaves.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PayrollModule } from './payroll/payroll.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidation }),
    DepartmentsModule,
    EmployeesModule,
    LeaveModule,
    AuthModule,
    AttendanceModule,
    PayrollModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
