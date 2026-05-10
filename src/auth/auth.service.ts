import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) throw new UnauthorizedException();

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException();

    const userPermissions = user.role.rolePermissions.map(
      (rp) => `${rp.permission.action}_${rp.permission.resource}`,
    );
    const payload: Payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
      permissions: userPermissions,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
