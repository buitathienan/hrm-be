import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UpdatePayrollPeriodDto } from './dto/update-payroll-period.dto';
import { Decimal } from '@prisma/client/runtime/client';
import { SalaryComponentType } from 'src/generated/prisma/enums';

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
      include: {
        payslips: true,
      },
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

  async process(periodId: number) {
    const payrollPeriod = await this.prisma.payrollPeriod.findUnique({
      where: { id: periodId },
    });
    if (!payrollPeriod) throw new NotFoundException('Payroll period not found');
    if (payrollPeriod.status !== 'DRAFT')
      throw new ConflictException('Payroll period status is not DRAFT');

    // Find all valid salary assignments
    const assignments = await this.prisma.salaryStructureAssignment.findMany({
      where: {
        fromDate: {
          lte: payrollPeriod.startDate,
        },
        OR: [
          {
            toDate: null,
          },
          {
            toDate: {
              gte: payrollPeriod.endDate,
            },
          },
        ],
        salaryStructure: {
          isActive: true,
        },
      },
      include: {
        salaryStructure: {
          include: {
            components: {
              include: {
                salaryComponent: true,
              },
            },
          },
        },
        employee: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    for (const assignment of assignments) {
      const payslipItems: {
        name: string;
        type: SalaryComponentType;
        amount: Decimal;
      }[] = [];
      let totalEarning = new Decimal(0);
      let totalDeduction = new Decimal(0);
      let totalGross = new Decimal(0);
      let totalNet = new Decimal(0);

      for (const component of assignment.salaryStructure.components) {
        let amount = new Decimal(0);
        const name = component.salaryComponent.name;
        const type = component.salaryComponent.type;

        if (component.calculationType === 'FIXED') {
          if (component.value === null)
            throw new BadRequestException(
              'FIXED calculation type requires a non-null value',
            );
          amount = component.value;
        } else if (component.calculationType === 'BASE_SALARY') {
          amount = assignment.baseSalary;
        }

        payslipItems.push({
          name,
          type,
          amount,
        });

        if (type === 'ALLOWANCE') totalEarning = totalEarning.add(amount);
        else if (type === 'DEDUCTION')
          totalDeduction = totalDeduction.add(amount);
      }

      totalGross = totalEarning;
      totalNet = totalGross.minus(totalDeduction);

      const payslip = await this.prisma.payslip.create({
        data: {
          employeeId: assignment.employeeId,
          employeeIdSnapshot: assignment.employeeId,
          employeeNameSnapshot: `${assignment.employee.firstName} ${assignment.employee.lastName}`,
          payrollPeriodId: periodId,
          totalEarning: totalEarning,
          totalDeduction: totalDeduction,
          totalGross,
          totalNet,
          totalTax: new Decimal(0),
          currency: 'VND',
          departmentSnapshot: assignment.employee.department.name,
          paidAt: new Date(),
          payslipItems: {
            createMany: {
              data: payslipItems,
            },
          },
        },
      });
    }

    return assignments;
  }
}
