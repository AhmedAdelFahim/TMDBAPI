import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import ERROR_CODE_LIST from '../filters/error-codes';
import { UnauthorizedException } from 'unified-errors-handler';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        message: 'Invalid Token',
        code: ERROR_CODE_LIST.INVALID_TOKEN,
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('app.tokenSecret'),
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException({
        message: 'Invalid Token',
        code: ERROR_CODE_LIST.INVALID_TOKEN,
      });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
