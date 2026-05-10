import { Controller, Get } from '@nestjs/common';
import { UserService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
