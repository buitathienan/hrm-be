import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AddSalaryStructureComponentsDto } from './dto/add-salary-structure-component.dto';
import { SalaryStructureService } from './salary-structure.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateSalaryStructureComponent } from './dto/update-salary-structure-component.dto';

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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salaryStructureService.findOne(id);
  }

  @Patch(':id/components/:componentId')
  updateComponent(
    @Param('id', ParseIntPipe) id: number,
    @Param('componentId', ParseIntPipe) componentId: number,
    @Body() dto: UpdateSalaryStructureComponent,
  ) {
    return this.salaryStructureService.updateComponent(id, componentId, dto);
  }
}
