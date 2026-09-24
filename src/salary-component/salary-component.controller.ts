import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SalaryComponentService } from './salary-component.service';
import { CreateSalaryComponentDto } from './dto/create-salary-component.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateSalaryComponentDto } from './dto/update-salary-component.dto';

@Controller('salary-component')
@ApiBearerAuth()
export class SalaryComponentController {
  constructor(
    private readonly salaryComponentService: SalaryComponentService,
  ) {}

  @Get()
  findAll() {
    return this.salaryComponentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salaryComponentService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSalaryComponentDto) {
    return this.salaryComponentService.createSalaryComponent(dto);
  }

  @Patch(':id')
  update(
    @Body() dto: UpdateSalaryComponentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.salaryComponentService.update(id, dto);
  }
}
