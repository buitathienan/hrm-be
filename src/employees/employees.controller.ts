import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private employeeService: EmployeesService) {}

  @Post()
  async createEmployee(@Body() createemployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createemployeeDto);
  }

  @Get()
  async getAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatEemployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updatEemployeeDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.employeeService.delete(id);
  }
}
