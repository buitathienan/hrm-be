import { PrismaService } from 'src/database/prisma.service';
import { CreateSalaryStructureAssignmentDto } from './dto/create-salary-structure-assignment.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateSalaryStructureAssignmentDto } from './dto/update-salary-structure-assignment.dto';

@Injectable()
export class SalaryStructureAssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSalaryStructureAssignmentDto) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: dto.employeeId,
      },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const salaryStructure = await this.prisma.salaryStructure.findUnique({
      where: { id: dto.salaryStructureId, isActive: true },
    });
    if (!salaryStructure)
      throw new NotFoundException('Salary structure not found');

    if (dto.toDate && dto.fromDate > dto.toDate)
      throw new BadRequestException('toDate is greater than fromDate');

    const salaryStructureAssignment =
      await this.prisma.salaryStructureAssignment.findFirst({
        where: {
          employeeId: dto.employeeId,

          ...(dto.toDate && {
            fromDate: {
              lte: dto.toDate,
            },
          }),

          OR: [
            {
              toDate: {
                gte: dto.fromDate,
              },
            },
            {
              toDate: null,
            },
          ],
        },
      });

    if (salaryStructureAssignment)
      throw new ConflictException('Salary assignment period overlaps');

    return this.prisma.salaryStructureAssignment.create({
      data: {
        salaryStructureId: dto.salaryStructureId,
        employeeId: dto.employeeId,
        fromDate: dto.fromDate,
        toDate: dto.toDate,
        baseSalary: dto.baseSalary,
      },
    });
  }

  async findAll() {
    return this.prisma.salaryStructureAssignment.findMany({
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        salaryStructure: true,
      },
      orderBy: {
        fromDate: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const salaryAssignment =
      await this.prisma.salaryStructureAssignment.findUnique({
        where: {
          id,
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          salaryStructure: true,
        },
      });

    if (!salaryAssignment)
      throw new NotFoundException('Salary structure assignment not found');

    return salaryAssignment;
  }

  async update(id: number, dto: UpdateSalaryStructureAssignmentDto) {
    const salaryStructureAsignment =
      await this.prisma.salaryStructureAssignment.findUnique({
        where: {
          id,
        },
      });
    if (!salaryStructureAsignment)
      throw new NotFoundException('Salary structure assignment not found');

    const finalFromDate = dto.fromDate ?? salaryStructureAsignment.fromDate;
    const finalToDate = dto.toDate ?? salaryStructureAsignment.toDate;
    if (finalToDate && finalFromDate > finalToDate)
      throw new BadRequestException('fromDate cannot greater than toDate');

    const overlapSalary = await this.prisma.salaryStructureAssignment.findFirst(
      {
        where: {
          id: {
            not: id,
          },
          employeeId: salaryStructureAsignment.employeeId,
          ...(finalToDate && {
            fromDate: {
              lte: finalToDate,
            },
          }),
          OR: [
            {
              toDate: null,
            },
            {
              toDate: {
                gte: finalFromDate,
              },
            },
          ],
        },
      },
    );
    if (overlapSalary)
      throw new ConflictException('Salary assignment period overlaps');

    return this.prisma.salaryStructureAssignment.update({
      data: dto,
      where: {
        id,
      },
    });
  }
}
