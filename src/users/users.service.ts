import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email },
      include: {
        role: {
          include: { rolePermissions: { include: { permission: true } } },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        role: {
          include: { rolePermissions: { include: { permission: true } } },
        },
      },
    });
  }
}
