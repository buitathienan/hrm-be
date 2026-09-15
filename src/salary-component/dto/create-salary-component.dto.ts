import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { SalaryComponentType } from 'src/generated/prisma/enums';

export class CreateSalaryComponentDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty()
  name!: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty()
  code!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @ApiPropertyOptional()
  description?: string;

  @IsEnum(SalaryComponentType)
  @ApiProperty({ enum: SalaryComponentType })
  type!: SalaryComponentType;
}
