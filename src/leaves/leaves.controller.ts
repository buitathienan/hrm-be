import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateLeaveStatus } from './dto/update-leave-status.dto';

@Controller('leave-requests')
@ApiTags('Leaves')
export class LeavesController {
  constructor(private leavesService: LeavesService) {}

  @Post()
  async createLeave(@Body() createLeaveRequestDto: CreateLeaveRequestDto) {
    return this.leavesService.createLeaveRequest(createLeaveRequestDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateLeaveStatus: UpdateLeaveStatus,
  ) {
    return this.leavesService.updateStatus(id, updateLeaveStatus.status);
  }
}
