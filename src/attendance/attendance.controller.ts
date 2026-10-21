import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';

@Controller('attendance')
@ApiTags('Attendance')
@ApiBearerAuth()
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('clockin')
  async checkIn(@Body() checkInDto: CheckInDto, @Req() req: any) {
    return this.attendanceService.checkIn(req.user.employeeId, checkInDto);
  }

  @Post('clockout')
  async clockOut(@Body() checkOutDto: CheckOutDto, @Req() req: any) {
    return this.attendanceService.checkOut(req.user.employeeId, checkOutDto);
  }

  @Get()
  async findAll(@Query() queryDto: AttendanceQueryDto) {
    return this.attendanceService.findAll(queryDto);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findById(id);
  }
}
