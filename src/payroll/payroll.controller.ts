import { Body, Controller, Post, Res } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { GeneratePayrollDto } from './dto/generative-payroll.dto';

@Controller('payroll')
export class PayrollController {
  constructor(private payrollService: PayrollService) {}
  @Post()
  async createPayrollRun(@Body() dto: GeneratePayrollDto, @Res() req: any) {
    return this.payrollService.draftPayrollRun(dto, req.user.employeeId);
  }
}
