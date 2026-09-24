import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSalaryComponentDto } from './dto/create-salary-component.dto';
import { UpdateSalaryComponentDto } from './dto/update-salary-component.dto';

@Injectable()
export class SalaryComponentService {
  constructor(private readonly prisma: PrismaService) {}

  createSalaryComponent(dto: CreateSalaryComponentDto) {
    return this.prisma.salaryComponent.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        type: dto.type,
      },
    });
  }

  findAll() {
    return this.prisma.salaryComponent.findMany();
  }

  findOne(id: number) {
    return this.prisma.salaryComponent.findUnique({
      where: { id },
    });
  }

  update(id: number, updateSalaryComponentDto: UpdateSalaryComponentDto) {
    return this.prisma.salaryComponent.update({
      data: updateSalaryComponentDto,
      where: { id },
    });
  }
}
