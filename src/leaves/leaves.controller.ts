import { Body, Controller, Post } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('leave-requests')
@ApiTags('Leaves')
export class LeavesController {
  constructor(private leavesService: LeavesService) {}

  @Post()
  async createLeave(@Body() createLeaveRequestDto: CreateLeaveRequestDto) {
    return this.leavesService.createLeaveRequest(createLeaveRequestDto);
  }
}
