import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';

@Module({
  controllers: [],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
