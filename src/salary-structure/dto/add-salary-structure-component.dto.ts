import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { SalaryComponentCalculationType } from 'src/generated/prisma/enums';

export class AddSalaryStructureComponentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddSalaryStructureComponentDto)
  @ArrayMinSize(1)
  components: AddSalaryStructureComponentDto[];
}

export class AddSalaryStructureComponentDto {
  @IsInt()
  salaryComponentId: number;

  @IsEnum(SalaryComponentCalculationType)
  calculationType: SalaryComponentCalculationType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @IsInt()
  @Min(0)
  sortOrder: number;
}
