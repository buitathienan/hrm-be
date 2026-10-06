import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, Min } from 'class-validator';

export class CreateSalaryStructureAssignmentDto {
  @IsInt()
  @ApiProperty()
  employeeId: number;

  @IsInt()
  @ApiProperty()
  salaryStructureId: number;

  @IsNumber()
  @Min(0)
  @ApiProperty()
  baseSalary: number;

  @IsDate()
  @ApiProperty()
  fromDate: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  toDate?: Date;
}
