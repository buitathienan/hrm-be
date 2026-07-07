import { Injectable } from '@nestjs/common';
import { GeneratePayrollDto } from './dto/generative-payroll.dto';
import { PrismaService } from 'src/database/prisma.service';
import { PayType } from 'src/generated/prisma/enums';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async draftPayrollRun(dto: GeneratePayrollDto, processedById: string) {
    const employees = await this.prisma.employee.findMany({
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

    for (const employee of employees) {
      const payslip = await this.caculateEmployeePayroll(
        dto.periodStart,
        dto.periodEnd,
        employee.id,
        employee.payrollInfo?.payType,
      );
    }
  }

  private async caculateEmployeePayroll(
    periodStart: Date,
    periodEnd: Date,
    employeeId: string,
    payType: PayType | undefined,
  ) {
    const attendanceAgg = await this.prisma.attendance.aggregate({
      where: {
        date: {
          gte: periodStart,
          lte: periodEnd,
        },
        employeeId,
      },
      _sum: { hoursWorked: true },
    });

    // If they didn't work any hours, it returns null, fallback to 0
    const totalWorkedHours = Number(attendanceAgg._sum.hoursWorked) || 0;

    switch (payType) {
      case 'HOURLY':
    }
  }
}
