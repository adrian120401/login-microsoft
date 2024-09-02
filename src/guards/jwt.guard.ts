import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('No token found in cookies');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromCookie(request: Request): string | null {
    if (!request.cookies) {
      request.rawHeaders.forEach((header, index) => {
        if (header === 'Cookie') {
          const cookie = request.rawHeaders[index + 1];
          request.cookies = cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key.trim()] = value;
            return acc;
          }, {});
        }
      });
    }
    return request.cookies?.accessToken || null;
  }
}
