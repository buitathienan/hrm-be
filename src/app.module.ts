import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from './env.validation';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidation }),
    DepartmentsModule,
    EmployeesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
