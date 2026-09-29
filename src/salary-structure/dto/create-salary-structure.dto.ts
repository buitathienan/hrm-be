import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSalaryStructureDto {
  @ApiProperty()
  @MaxLength(100)
  @IsString()
  name: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(500)
  @IsString()
  description?: string;
}
