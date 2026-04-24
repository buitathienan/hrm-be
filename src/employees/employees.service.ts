import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: data,
    });
  }

  async findAll() {
    return this.prisma.employee.findMany();
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });
    if (!employee) throw new NotFoundException();
    return employee;
  }

  async update(id: string, data: UpdateEmployeeDto) {
    return this.prisma.employee.update({
      data: data,
      where: { id },
    });
  }

  async delete(id: string) {
    return this.prisma.employee.delete({ where: { id } });
  }
}
