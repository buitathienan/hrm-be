import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('attendance')
@ApiTags('Attendance')
export class AttendanceController {}
