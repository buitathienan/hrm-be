import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmployeeQueryDto } from './dto/employee-query.dto';

@ApiTags('Employees')
@Controller('employees')
@ApiBearerAuth()
export class EmployeesController {
  constructor(private employeeService: EmployeesService) {}

  @Post()
  async createEmployee(@Body() createemployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createemployeeDto);
  }

  @Get()
  async getAll(@Query() employeeQuery: EmployeeQueryDto) {
    return this.employeeService.findAll(employeeQuery);
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
