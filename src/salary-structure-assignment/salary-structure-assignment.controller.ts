import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateSalaryStructureAssignmentDto } from './dto/create-salary-structure-assignment.dto';
import { SalaryStructureAssignmentService } from './salary-structure-assignment.service';
import { UpdateSalaryStructureAssignmentDto } from './dto/update-salary-structure-assignment.dto';

@Controller('salary-structure-assignments')
export class SalaryStructureAssignmentController {
  constructor(
    private salaryStructureAssigmentService: SalaryStructureAssignmentService,
  ) {}

  @Post()
  createAssigment(@Body() dto: CreateSalaryStructureAssignmentDto) {
    return this.salaryStructureAssigmentService.create(dto);
  }

  @Get()
  findAll() {
    return this.salaryStructureAssigmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.salaryStructureAssigmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateSalaryStructureAssignmentDto,
  ) {
    return this.salaryStructureAssigmentService.update(id, dto);
  }
}
