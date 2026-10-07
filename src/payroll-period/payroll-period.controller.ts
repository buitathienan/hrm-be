import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PayrollPeriodService } from './payroll-period.service';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';
import { UpdatePayrollPeriodDto } from './dto/update-payroll-period.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('payroll-periods')
export class PayrollPeriodController {
  constructor(private payrollPeriodService: PayrollPeriodService) {}

  @Post()
  create(@Body() dto: CreatePayrollPeriodDto) {
    return this.payrollPeriodService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePayrollPeriodDto,
  ) {
    return this.payrollPeriodService.update(id, dto);
  }

  @Get()
  findAll() {
    return this.payrollPeriodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.payrollPeriodService.findOne(id);
  }

  @Post(':id/process')
  process(@Param('id', ParseIntPipe) id: number) {
    return this.payrollPeriodService.process(id);
  }
}
