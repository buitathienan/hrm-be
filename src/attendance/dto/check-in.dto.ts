import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;
}
