import { OmitType, PartialType } from '@nestjs/swagger';
import { AddSalaryStructureComponentDto } from './add-salary-structure-component.dto';

export class UpdateSalaryStructureComponent extends PartialType(
  OmitType(AddSalaryStructureComponentDto, ['salaryComponentId'] as const),
) {}
