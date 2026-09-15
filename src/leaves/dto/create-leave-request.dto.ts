import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  endDate: Date;

  @IsNumber()
  @ApiProperty()
  employeeId: number;

  @IsNumber()
  @ApiProperty()
  leaveTypeId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  reason?: string;
}
