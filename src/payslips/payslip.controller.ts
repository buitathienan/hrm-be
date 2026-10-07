import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PayslipService } from './payslip.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('payslips')
export class PayslipController {
  constructor(private payslipService: PayslipService) {}

  @Get()
  findAll() {
    return this.payslipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.payslipService.findOne(id);
  }
}
