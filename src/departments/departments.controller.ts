import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentsService } from './departments.service';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private departmentService: DepartmentsService) {}
  @Post()
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  async getAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.departmentService.delete(id);
  }
}
