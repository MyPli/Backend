"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const google_auth_library_1 = require("google-auth-library");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    async signup(signupDto) {
        const { email, password, nickname } = signupDto;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.prisma.user.create({
                data: { email, password: hashedPassword, nickname },
            });
            return { message: '회원가입이 완료되었습니다.', userId: user.id };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('이미 사용 중인 이메일 또는 닉네임입니다.');
            }
            throw error;
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
        const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });
        await this.prisma.session.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                accessToken,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            update: {
                accessToken,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return { accessToken, refreshToken };
    }
    async googleLogin(payload) {
        const { email, firstName, lastName, picture, sub } = payload;
        const user = await this.prisma.user.upsert({
            where: { email },
            create: {
                email,
                authProvider: 'google',
                authProviderId: sub,
                nickname: `${firstName} ${lastName}`,
                profileImage: picture,
            },
            update: {
                authProviderId: sub,
                nickname: `${firstName} ${lastName}`,
                profileImage: picture,
            },
        });
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
        const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });
        await this.prisma.session.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                accessToken,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            update: {
                accessToken,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return { accessToken, refreshToken };
    }
    async logout(userId) {
        await this.prisma.session.deleteMany({
            where: { userId },
        });
        return { message: '로그아웃 성공' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map