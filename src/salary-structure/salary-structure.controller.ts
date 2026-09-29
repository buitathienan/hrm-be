import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AddSalaryStructureComponentsDto } from './dto/add-salary-structure-component.dto';
import { SalaryStructureService } from './salary-structure.service';

@Controller('salary-structure')
export class SalaryStructureController {
  constructor(private salaryStructureService: SalaryStructureService) {}

  @Post(':id/components')
  addComponents(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddSalaryStructureComponentsDto,
  ) {
    return this.salaryStructureService.addComponents(id, dto);
  }
}
