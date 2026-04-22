import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}
  async create() {}
}
