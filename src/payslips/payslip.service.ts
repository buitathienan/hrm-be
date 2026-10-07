import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PayslipService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const payslip = await this.prisma.payslip.findMany();
    return payslip;
  }

  async findOne(id: number) {
    const payslip = await this.prisma.payslip.findUnique({
      where: {
        id,
      },
    });
    if (!payslip) throw new NotFoundException('Payslip not found');

    return payslip;
  }
}
