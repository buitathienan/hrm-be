import { Injectable } from '@nestjs/common';
import { GeneratePayrollDto } from './dto/generative-payroll.dto';
import { PrismaService } from 'src/database/prisma.service';

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
      const attendanceAgg = await this.prisma.attendance.aggregate({
        where: {
          date: {
            gte: dto.periodStart,
            lte: dto.periodEnd,
          },
          employeeId: employee.id,
        },
        _sum: { hoursWorked: true },
      });

      // If they didn't work any hours, it returns null, fallback to 0
      const totalWorkedHours = Number(attendanceAgg._sum || 0);
      console.log(`Caculating for emp id: ${employee.id}`);
      console.log(`Total hours worked: ${totalWorkedHours}`);
      console.log(
        `Base salary: ${employee.payrollInfo?.baseSalary.toString()}`,
      );
    }
  }
}
