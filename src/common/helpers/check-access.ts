import { ForbiddenException } from '@nestjs/common';
import { Payload } from 'src/auth/interfaces/payload.interface';

export function checkAccess(user: Payload, targetId: number) {
  if (user.role === 'EMPLOYEE' && user.employeeId !== targetId)
    throw new ForbiddenException('You are not allowed to access this resource');
}
