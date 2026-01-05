import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { UserStatus } from '../../user/entities/user.entity';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey =
      (request.headers['x-api-key'] as string | undefined) ||
      (request.headers['authorization']?.startsWith('ApiKey ')
        ? request.headers['authorization'].slice('ApiKey '.length)
        : undefined);

    if (!apiKey) {
      throw new UnauthorizedException('Missing API key');
    }

    const user = await this.userService.findByApiKey(apiKey);
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Attach user to request for downstream handlers
    (request as any).user = user;
    return true;
  }
}
