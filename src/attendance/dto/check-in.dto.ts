import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CheckInDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  notes: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'WEB, PHONE, ...',
  })
  source: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber()
  longitude: number;
}
