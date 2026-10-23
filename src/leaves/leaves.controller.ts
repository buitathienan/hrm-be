import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateLeaveStatus } from './dto/update-leave-status.dto';

@Controller('leave-requests')
@ApiTags('Leaves')
@ApiBearerAuth()
export class LeavesController {
  constructor(private leavesService: LeavesService) {}

  @Get()
  async findAll() {
    return this.leavesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leavesService.findOne(id);
  }

  @Post()
  async createLeave(@Body() createLeaveRequestDto: CreateLeaveRequestDto) {
    return this.leavesService.createLeaveRequest(createLeaveRequestDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateLeaveStatus: UpdateLeaveStatus,
  ) {
    return this.leavesService.updateStatus(id, updateLeaveStatus.status);
  }
}
