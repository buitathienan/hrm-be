import { Module } from '@nestjs/common';
import { LeaveService } from './leaves.service';

@Module({
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {}
