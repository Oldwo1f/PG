import {
  Controller,
  Get,
  Body,
  Patch,
  Req,
  UseGuards,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ChangeUserPlanDto } from './dto/change-user-plan.dto';

interface AuthenticatedRequest extends Request {
  user: User;
}

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: "Get current user's profile" })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(
    @Req() req: AuthenticatedRequest,
  ): Omit<
    User,
    | 'password'
    | 'hashPassword'
    | 'validatePassword'
    | 'getFullName'
    | 'isEmailVerified'
    | 'isSubscriptionActive'
    | 'getMonthlyImageLimit'
    | 'getMonthlyApiLimit'
    | 'canGenerateImage'
    | 'canMakeApiCall'
    | 'resetMonthlyUsage'
    | 'subscription'
    | 'plan'
  > {
    // We remove password and methods from the user object before returning it
    const { password, ...user } = req.user;
    // Ensure apiKey is never leaked in profile payloads
    (user as any).apiKey = undefined;
    return user;
  }

  @Patch('me')
  @ApiOperation({ summary: "Update current user's profile" })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.', type: User })
  updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Post('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Change current user's password" })
  @ApiResponse({ status: 204, description: 'Password changed successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., wrong password).',
  })
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.userService.changePassword(
      req.user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete current user's account" })
  @ApiResponse({ status: 204, description: 'Account deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async deleteAccount(@Req() req: AuthenticatedRequest): Promise<void> {
    await this.userService.delete(req.user.id);
  }

  @Patch('me/plan')
  @ApiOperation({ summary: "Change current user's subscription plan" })
  @ApiResponse({ status: 200, description: 'Plan changed successfully.' })
  async changeMyPlan(
    @Req() req: AuthenticatedRequest,
    @Body() changeUserPlanDto: ChangeUserPlanDto,
  ): Promise<{ success: true }> {
    await this.userService.changeUserPlan(req.user.id, changeUserPlanDto.planId);
    return { success: true };
  }

  // API Key management
  @Get('me/api-key')
  @ApiOperation({ summary: "Get current user's API key (masked) and status" })
  @ApiResponse({ status: 200, description: 'API key status retrieved.' })
  async getApiKey(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ hasApiKey: boolean; maskedKey: string | null }> {
    const user = req.user as User;
    const apiKey = user.apiKey || null;
    const maskedKey = apiKey ? `${apiKey.slice(0, 6)}••••${apiKey.slice(-4)}` : null;
    return { hasApiKey: !!apiKey, maskedKey };
  }

  @Post('me/api-key')
  @ApiOperation({ summary: 'Generate a new API key (overwrites existing)' })
  @ApiResponse({ status: 201, description: 'API key generated.' })
  async generateApiKey(@Req() req: AuthenticatedRequest): Promise<{ apiKey: string }> {
    const apiKey = await this.userService.generateApiKey((req.user as User).id);
    return { apiKey };
  }

  @Delete('me/api-key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke current API key' })
  @ApiResponse({ status: 204, description: 'API key revoked.' })
  async revokeApiKey(@Req() req: AuthenticatedRequest): Promise<void> {
    await this.userService.updateUser((req.user as User).id, { apiKey: null });
  }
}
