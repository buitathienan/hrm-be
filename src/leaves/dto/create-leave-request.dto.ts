import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  endDate: Date;

  @IsString()
  @ApiProperty()
  employeeId: string;

  @IsString()
  @ApiProperty()
  leaveTypeId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  reason?: string;
}
