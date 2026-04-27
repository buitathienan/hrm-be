import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { compareAsc, differenceInDays } from 'date-fns';
import { LeaveStatus } from 'src/generated/prisma/enums';

@Injectable()
export class LeavesService {
  constructor(private prisma: PrismaService) {}

  async createLeaveRequest(data: CreateLeaveRequestDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const leaveBalance = await tx.leaveBalance.findFirst({
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
      const existingRequest = await tx.leaveRequest.findFirst({
        where: {
          AND: {
            startDate: { lte: data.endDate },
            endDate: { gte: data.startDate },
            OR: [{ status: 'PENDING' }, { status: 'APPROVED' }],
          },
        },
      });
      if (existingRequest) {
        throw new BadRequestException('Already have leave request in that day');
      }

      const totalRequestDays =
        differenceInDays(data.endDate, data.startDate) + 1;

      if (leaveBalance.entitled.minus(totalRequestDays).toNumber() < 0) {
        throw new BadRequestException(
          'Total leave days should not be bigger than total entitled days',
        );
      }
      await tx.leaveBalance.update({
        where: { id: leaveBalance.id },
        data: {
          pending: { increment: totalRequestDays },
          entitled: {
            decrement: totalRequestDays,
          },
        },
      });
      return tx.leaveRequest.create({
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
    });
    return result;
  }

  async updateStatus(id: string, status: LeaveStatus) {
    const leaveRequest = await this.prisma.leaveRequest.findUnique({
      where: { id },
    });
    if (!leaveRequest) throw new NotFoundException('Leave request not found');
    if (leaveRequest.status === 'REJECTED' && status === 'REJECTED')
      throw new BadRequestException();

    const result = await this.prisma.$transaction(async (tx) => {
      const leaveBalance = await tx.leaveBalance.findFirst({
        where: {
          leaveTypeId: leaveRequest?.leaveTypeId,
          employeeId: leaveRequest?.employeeId,
          year: new Date().getFullYear(),
        },
      });

      if (!leaveBalance) throw new NotFoundException('Leave balance not found');

      if (status === 'REJECTED') {
        await tx.leaveBalance.update({
          where: { id: leaveBalance.id },
          data: {
            pending: { decrement: leaveRequest.totalDays },
            entitled: { increment: leaveRequest.totalDays },
          },
        });
      } else if (status === 'APPROVED') {
        await tx.leaveBalance.update({
          where: { id: leaveBalance.id },
          data: {
            pending: { decrement: leaveRequest.totalDays },
          },
        });
      }

      return tx.leaveRequest.update({ where: { id }, data: { status } });
    });

    return result;
  }
}
