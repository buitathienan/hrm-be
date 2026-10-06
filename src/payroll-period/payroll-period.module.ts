import { Module } from '@nestjs/common';
import { PayrollPeriodController } from './payroll-period.controller';
import { PayrollPeriodService } from './payroll-period.service';

@Module({
  controllers: [PayrollPeriodController],
  providers: [PayrollPeriodService],
})
export class PayrollPeriodModule {}
