import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { compareAsc, differenceInDays } from 'date-fns';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  async createLeaveRequest(data: CreateLeaveRequestDto) {
    const leaveType = await this.prisma.leaveType.findUnique({
      where: { id: data.leaveTypeId },
    });
    const employee = await this.prisma.employee.findUnique({
      where: { id: data.employeeId },
    });
    if (!employee || !leaveType) throw new NotFoundException();

    const leaveBalance = await this.prisma.leaveBalance.findFirst({
      where: {
        employeeId: data.employeeId,
        leaveTypeId: data.leaveTypeId,
        year: new Date().getFullYear(),
      },
    });
    if (leaveBalance && leaveBalance.entitled.toNumber() <= 0)
      throw new BadRequestException('You have used all days left in balance');
    else if (!leaveBalance)
      throw new BadRequestException('Cannot find leave balance');

    if (
      compareAsc(data.startDate, data.endDate) === 1 ||
      compareAsc(data.startDate, new Date()) === -1
    )
      throw new BadRequestException('Start date or end date is not valid');

    const existingRequest = await this.prisma.leaveRequest.findFirst({
      where: {
        AND: {
          startDate: { lte: data.startDate },
          endDate: { gte: data.endDate },
          OR: [{ status: 'PENDING' }, { status: 'APPROVED' }],
        },
      },
    });
    if (existingRequest) {
      throw new BadRequestException('Already have leave request in that day');
    }
    await this.minusLeaveBalance(
      leaveBalance.id,
      differenceInDays(data.endDate, data.startDate),
      1,
    );
    return this.prisma.leaveRequest.create({
      data: {
        employeeId: data.employeeId,
        leaveTypeId: data.leaveTypeId,
        startDate: data.startDate,
        endDate: data.endDate,
        totalDays: differenceInDays(data.endDate, data.startDate) + 1,
        status: 'PENDING',
        reason: data?.reason ? data.reason : null,
      },
    });
  }

  async minusLeaveBalance(
    leaveBalanceId: string,
    totalLeaveDays: number,
    totalPendingRequest: number,
  ) {
    const leaveBalance = await this.prisma.leaveBalance.findUnique({
      where: { id: leaveBalanceId },
    });
    if (!leaveBalance) throw new NotFoundException('Leave request not found');

    if (leaveBalance.entitled.minus(totalLeaveDays).toNumber() < 0) {
      throw new BadRequestException(
        'Total leave days should not be bigger than total entitled days',
      );
    }
    const updateLeaveBalance = await this.prisma.leaveBalance.update({
      where: { id: leaveBalanceId },
      data: {
        pending: leaveBalance.pending.add(totalPendingRequest),
        entitled: leaveBalance.entitled.minus(totalLeaveDays),
      },
    });
  }
}
