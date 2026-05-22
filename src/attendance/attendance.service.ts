import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CheckInDto } from './dto/check-in.dto';
import { AttendanceStatus } from 'src/generated/prisma/enums';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async checkIn(employeeId: string, data: CheckInDto) {
    console.log('Check-in data:', { employeeId, ...data });
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));

    if (data.latitude && data.longitude) {
      const currentShift = await this.prisma.shiftSchedule.findFirst({
        where: {
          AND: [{ startDate: { gte: today } }, { endDate: { lte: today } }],
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

      const checkIn = await this.prisma.attendance.findFirst({
        where: {
          date: today,
          employeeId,
        },
      });
      if (checkIn)
        throw new ConflictException('You have already clocked in today.');

      const distance = calculateDistance(
        data.latitude,
        data.longitude,
        10.7626, // Ho Chi Minh City
        106.6601,
      );

      if (distance > 2000)
        throw new ForbiddenException(
          'You are not within the allowed office radius',
        );

      const startTime = currentShift.shift.startTime;
      const [hours, minutes] = startTime.split(':').map(Number);
      const expectedTime = new Date(now);
      let status: AttendanceStatus = AttendanceStatus.PRESENT;
      expectedTime.setHours(hours, minutes, 0, 0);

      if (now > expectedTime) {
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
