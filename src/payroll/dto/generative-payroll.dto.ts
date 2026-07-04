import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class GeneratePayrollDto {
  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  periodStart: Date;

  @ApiProperty({ example: '2026-06-30T00:00:00.000Z' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  periodEnd: Date;

  @ApiProperty({ example: '2026-07-05T00:00:00.000Z' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  payDate: Date;
}
