import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: data,
    });
  }

  async findAll() {
    return this.prisma.department.findMany();
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });
    if (!department) throw new NotFoundException();
  }

  async update(id: string, data: UpdateDepartmentDto) {
    return this.prisma.department.update({
      data: data,
      where: { id },
    });
  }

  async delete(id: string) {
    return this.prisma.department.delete({ where: { id } });
  }
}
