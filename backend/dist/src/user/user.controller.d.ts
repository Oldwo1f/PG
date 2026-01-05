import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { ChangeUserPlanDto } from './dto/change-user-plan.dto';
interface AuthenticatedRequest extends Request {
    user: User;
}
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: AuthenticatedRequest): Omit<User, 'password' | 'hashPassword' | 'validatePassword' | 'getFullName' | 'isEmailVerified' | 'isSubscriptionActive' | 'getMonthlyImageLimit' | 'getMonthlyApiLimit' | 'canGenerateImage' | 'canMakeApiCall' | 'resetMonthlyUsage' | 'subscription' | 'plan'>;
    updateProfile(req: AuthenticatedRequest, updateUserDto: UpdateUserDto): Promise<User>;
    changePassword(req: AuthenticatedRequest, changePasswordDto: ChangePasswordDto): Promise<void>;
    deleteAccount(req: AuthenticatedRequest): Promise<void>;
    changeMyPlan(req: AuthenticatedRequest, changeUserPlanDto: ChangeUserPlanDto): Promise<{
        success: true;
    }>;
    getApiKey(req: AuthenticatedRequest): Promise<{
        hasApiKey: boolean;
        maskedKey: string | null;
    }>;
    generateApiKey(req: AuthenticatedRequest): Promise<{
        apiKey: string;
    }>;
    revokeApiKey(req: AuthenticatedRequest): Promise<void>;
}
export {};
