import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from '../decorators/permissons.decorator';
import { Payload } from '../interfaces/payload.interface';

interface RequestWithUser extends Request {
  user: Payload;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const userPermissions = request.user.permissions || [];

    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
