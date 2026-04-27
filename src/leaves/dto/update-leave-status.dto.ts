import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LeaveStatus } from 'src/generated/prisma/enums';

export class UpdateLeaveStatus {
  @IsEnum(LeaveStatus)
  @ApiProperty({ enum: LeaveStatus })
  status: LeaveStatus;
}
