import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AddSalaryStructureComponentsDto } from './dto/add-salary-structure-component.dto';
import { SalaryStructureService } from './salary-structure.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('salary-structure')
@ApiBearerAuth()
export class SalaryStructureController {
  constructor(private salaryStructureService: SalaryStructureService) {}

  @Post(':id/components')
  addComponents(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddSalaryStructureComponentsDto,
  ) {
    return this.salaryStructureService.addComponents(id, dto);
  }

  @Get()
  findAll() {
    return this.salaryStructureService.findAll();
  }
}
