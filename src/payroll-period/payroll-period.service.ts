import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UpdatePayrollPeriodDto } from './dto/update-payroll-period.dto';

@Injectable()
export class PayrollPeriodService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePayrollPeriodDto) {
    if (dto.startDate > dto.endDate)
      throw new BadRequestException('startDate cannot greater than endDate');

    const overlapPayrollPeriod = await this.prisma.payrollPeriod.findFirst({
      where: {
        startDate: {
          lte: dto.endDate,
        },
        endDate: {
          gte: dto.startDate,
        },
      },
    });
    if (overlapPayrollPeriod)
      throw new ConflictException('Payroll period is overlap');

    return this.prisma.payrollPeriod.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.payrollPeriod.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const payrollPeriod = await this.prisma.payrollPeriod.findUnique({
      where: { id },
    });

    if (!payrollPeriod) throw new NotFoundException('Payroll period not found');
    return payrollPeriod;
  }

  async update(id: number, dto: UpdatePayrollPeriodDto) {
    const payrollPeriod = await this.prisma.payrollPeriod.findUnique({
      where: { id },
    });
    if (!payrollPeriod) throw new NotFoundException('Payroll period not found');

    const finalStartDate = dto.startDate ?? payrollPeriod.startDate;
    const finalEndDate = dto.endDate ?? payrollPeriod.endDate;
    if (finalStartDate > finalEndDate)
      throw new BadRequestException('startDate cannot greater than endDate');

    const overlapPayrollPeriod = await this.prisma.payrollPeriod.findFirst({
      where: {
        id: {
          not: id,
        },

        startDate: {
          lte: finalEndDate,
        },

        endDate: {
          gte: finalStartDate,
        },
      },
    });

    if (overlapPayrollPeriod)
      throw new ConflictException('Payoll period is overlap');
    return this.prisma.payrollPeriod.update({
      where: {
        id,
      },
      data: dto,
    });
  }
}
