import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CheckInDto } from './dto/check-in.dto';
import { AttendanceStatus } from 'src/generated/prisma/enums';
import { CheckOutDto } from './dto/check-out.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async checkIn(employeeId: string, data: CheckInDto) {
    if (!data.latitude || !data.longitude) {
      throw new BadRequestException(
        'Location coordinates are required to clock in.',
      );
    }

    const now = new Date(); // Time
    const today = new Date(); // Date
    today.setHours(0, 0, 0, 0);

    const distance = calculateDistance(data.latitude, data.longitude, 1, 1);
    if (distance > 500) {
      // 509 mean 500m
      throw new ForbiddenException(
        'You are not within the allowed office radius.',
      );
    }

    const checkIn = await this.prisma.attendance.findFirst({
      where: {
        date: today,
        employeeId,
      },
    });
    if (checkIn)
      throw new ConflictException('You have already clocked in today.');

    const currentShift = await this.prisma.shiftSchedule.findFirst({
      where: {
        startDate: { lte: today },
        OR: [{ endDate: { gte: today } }, { endDate: null }],
        employeeId,
      },
      include: {
        shift: true,
      },
    });

    if (!currentShift)
      throw new BadRequestException(
        'No shift found for today. Cannot clock in',
      );

    const startTime = currentShift.shift.startTime;
    const [hours, minutes] = startTime.split(':').map(Number);

    const expectedTime = new Date(now);
    expectedTime.setHours(hours, minutes, 0, 0);

    const gracePeriodEnd = new Date(expectedTime);
    gracePeriodEnd.setMinutes(gracePeriodEnd.getMinutes() + 10);

    let status: AttendanceStatus = AttendanceStatus.PRESENT;

    if (now > gracePeriodEnd) {
      status = AttendanceStatus.LATE;
    }

    return this.prisma.attendance.create({
      data: {
        employeeId,
        date: today,
        checkIn: now,
        status,
        source: data.source,
        notes: data.notes,
      },
    });
  }

  async checkOut(employeeId: string, data: CheckOutDto) {
    if (!data.latitude || !data.longitude) {
      throw new BadRequestException(
        'Location coordinates are required to clock out.',
      );
    }

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const distance = calculateDistance(data.latitude, data.longitude, 1, 1);
    if (distance > 500) {
      // 500 mean 500m
      throw new ForbiddenException(
        'You are not within the allowed office radius.',
      );
    }

    const checkIn = await this.prisma.attendance.findFirst({
      where: {
        date: today,
        employeeId,
      },
    });

    if (!checkIn?.checkIn)
      throw new BadRequestException('You never clocked in today.');
    else if (checkIn.checkOut)
      throw new BadRequestException('You have already clocked out today.');

    const rawHours =
      (now.getTime() - checkIn.checkIn?.getTime()) / (1000 * 60 * 60);
    return this.prisma.attendance.update({
      where: {
        id: checkIn.id,
      },
      data: {
        checkOut: now,
        hoursWorked: rawHours,
      },
    });
  }

  async findAll() {
    return this.prisma.attendance.findMany();
  }

  async findByEmployeeId(id: string) {
    return this.prisma.attendance.findFirst({ where: { employeeId: id } });
  }
}

// Haversine mathematical formula use for calculate distance
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth's radius in meters
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) *
      Math.cos(lat2 * rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Returns distance in meters
}
