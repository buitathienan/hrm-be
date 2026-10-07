import { Module } from '@nestjs/common';
import { PayslipService } from './payslip.service';
import { PayslipController } from './payslip.controller';

@Module({
  providers: [PayslipService],
  controllers: [PayslipController],
})
export class PayslipModule {}
