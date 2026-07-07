import { Body, Controller, Post, Req } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { GeneratePayrollDto } from './dto/generative-payroll.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Payroll')
@Controller('payroll')
@ApiBearerAuth()
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Post()
  async createPayrollRun(@Body() dto: GeneratePayrollDto, @Req() req: any) {
    return this.payrollService.draftPayrollRun(dto, req.user.employeeId);
  }
}
