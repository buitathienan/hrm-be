import { Body, Controller } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Payroll')
@Controller('payroll')
@ApiBearerAuth()
export class PayrollController {
  constructor(private payrollService: PayrollService) {}
}
