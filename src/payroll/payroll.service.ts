import { Injectable } from '@nestjs/common';
import { GeneratePayrollDto } from './dto/generative-payroll.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}
  async draftPayrollRun(dto: GeneratePayrollDto, processedById: string) {
    const employee = await this.prisma.employee.findMany({
      where: {
        payrollInfo: {
          isNot: null,
        },
      },
      include: {
        payrollInfo: {
          include: {
            allowances: true,
            deductions: true,
          },
        },
      },
    });
  }
}
