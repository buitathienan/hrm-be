import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PageMeta } from 'src/common/interfaces/pagination/page-meta.interface';
import { PaginatedResult } from 'src/common/interfaces/pagination/paginated-result.interface';
import { Employee, Prisma } from 'src/generated/prisma/client';
import { EmployeeQueryDto } from './dto/employee-query.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: data,
    });
  }

  async findAll(
    employeeQuery: EmployeeQueryDto,
  ): Promise<PaginatedResult<Employee>> {
    const { page = 1, limit = 10, search } = employeeQuery;

    const where: Prisma.EmployeeWhereInput = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, count] = await Promise.all([
      this.prisma.employee.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      this.prisma.employee.count(),
    ]);

    const meta: PageMeta = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };

    const result: PaginatedResult<Employee> = {
      data,
      meta,
    };

    return result;
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
