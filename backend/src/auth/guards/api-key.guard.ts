import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { UserStatus } from '../../user/entities/user.entity';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKey(request);

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

  private extractApiKey(request: Request): string | undefined {
    const headerKey = request.headers['x-api-key'] as string | undefined;
    if (headerKey) return headerKey;

    const auth = request.headers['authorization'];
    if (!auth) return undefined;

    if (auth.startsWith('ApiKey ')) {
      return auth.slice('ApiKey '.length).trim();
    }

    if (auth.startsWith('Bearer ')) {
      const token = auth.slice('Bearer '.length).trim();
      if (token.startsWith('pk_')) {
        return token;
      }
    }

    return undefined;
  }
}
