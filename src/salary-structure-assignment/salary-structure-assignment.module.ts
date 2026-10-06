import { Module } from '@nestjs/common';
import { SalaryStructureAssignmentService } from './salary-structure-assignment.service';
import { SalaryStructureAssignmentController } from './salary-structure-assignment.controller';

@Module({
  providers: [SalaryStructureAssignmentService],
  controllers: [SalaryStructureAssignmentController],
})
export class SalaryStructureAssignmentModule {}
