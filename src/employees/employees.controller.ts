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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { Payload } from 'src/auth/interfaces/payload.interface';
import { checkAccess } from 'src/common/helpers/check-access';
import { Permissions } from 'src/auth/decorators/permissons.decorator';

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
  async getOne(@Param('id') id: number, @CurrentUser() user: Payload) {
    checkAccess(user, id);

    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatEemployeeDto: UpdateEmployeeDto,
    @CurrentUser() user: Payload,
  ) {
    checkAccess(user, id);

    return this.employeeService.update(id, updatEemployeeDto);
  }

  @Delete(':id')
  @Permissions('delete_employee')
  async delete(@Param('id') id: number) {
    return this.employeeService.delete(id);
  }
}
