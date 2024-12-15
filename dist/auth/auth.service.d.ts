import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private googleClient;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signup(signupDto: SignupDto): Promise<{
        message: string;
        userId: number;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    googleLogin(payload: {
        email: string;
        firstName: string;
        lastName: string;
        picture: string;
        sub: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: number): Promise<{
        message: string;
    }>;
}
