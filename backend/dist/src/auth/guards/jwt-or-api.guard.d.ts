import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiKeyAuthGuard } from './api-key.guard';
export declare class JwtOrApiKeyGuard implements CanActivate {
    private readonly jwtGuard;
    private readonly apiKeyGuard;
    constructor(jwtGuard: JwtAuthGuard, apiKeyGuard: ApiKeyAuthGuard);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
