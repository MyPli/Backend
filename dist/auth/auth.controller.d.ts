import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<{
        message: string;
        userId: number;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any): Promise<{
        message: string;
        user: any;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
