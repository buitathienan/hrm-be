import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSalaryStructureAssignmentDto } from './create-salary-structure-assignment.dto';

export class UpdateSalaryStructureAssignmentDto extends PartialType(
  OmitType(CreateSalaryStructureAssignmentDto, [
    'employeeId',
    'salaryStructureId',
  ]),
) {}
