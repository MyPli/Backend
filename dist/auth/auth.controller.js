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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const signup_dto_1 = require("./dto/signup.dto");
const passport_1 = require("@nestjs/passport");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(signupDto) {
        return this.authService.signup(signupDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async googleAuth() {
    }
    async googleAuthRedirect(req) {
        return {
            message: 'Google 소셜로그인에 성공했습니다',
            user: req.user,
        };
    }
    async logout(req) {
        const userId = req.user.userId;
        await this.authService.logout(userId);
        return { message: '로그아웃에 성공했습니다' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '사용자 회원가입', description: '새로운 사용자 계정을 생성합니다.' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '회원가입 성공',
        schema: {
            example: {
                message: '회원가입이 완료되었습니다.',
                userId: 1,
            },
        },
    }),
    (0, common_1.Post)('signup'),
    (0, swagger_1.ApiOperation)({ summary: '회원가입', description: '이메일과 비밀번호로 새로운 계정을 생성합니다.' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '회원가입 성공',
        schema: {
            example: {
                message: '회원가입이 완료되었습니다.',
                userId: 1,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '입력값이 잘못되었습니다.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '사용자 로그인', description: '이메일과 비밀번호로 로그인합니다.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '로그인 성공',
        schema: {
            example: {
                accessToken: 'jwt-access-token',
                refreshToken: 'jwt-refresh-token',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '인증 오류',
        schema: {
            example: {
                statusCode: 401,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.',
                error: 'Unauthorized',
            },
        },
    }),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: '로그인', description: '이메일과 비밀번호로 로그인하여 JWT를 반환합니다.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '로그인에 성공했습니다. 액세스 토큰이 반환됩니다.',
        schema: {
            example: {
                accessToken: 'jwt-token',
                refreshToken: 'refresh-token',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '인증에 실패했습니다.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth 로그인', description: 'Google 계정으로 로그인합니다.' }),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'Google 인증 페이지로 리다이렉트됩니다.' }),
    (0, common_1.Get)('google'),
    (0, swagger_1.ApiOperation)({
        summary: 'Google 로그인 페이지로 리다이렉트',
        description: 'Google 로그인 페이지로 리다이렉트합니다.',
    }),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'Google 로그인 페이지로 리다이렉트합니다.' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth 콜백', description: 'Google 로그인 후 콜백을 처리합니다.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Google 로그인 성공',
        schema: {
            example: {
                message: '구글 소셜로그인에 성공했습니다',
                user: {
                    email: 'user@example.com',
                    nickname: 'John Doe',
                    profileImage: 'http://example.com/profile.jpg',
                },
            },
        },
    }),
    (0, common_1.Get)('google/callback'),
    (0, swagger_1.ApiOperation)({
        summary: 'Google 로그인 콜백 처리',
        description: 'Google 로그인 이후의 콜백을 처리하고 사용자 정보를 반환합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Google 소셜로그인에 성공했습니다.',
        schema: {
            example: {
                message: 'Google 소셜로그인에 성공했습니다',
                user: {
                    id: '12345',
                    email: 'example@gmail.com',
                    name: '사용자 이름',
                },
            },
        },
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '로그아웃', description: '로그아웃 로직을 수행합니다.' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '로그아웃 성공',
        schema: {
            example: {
                message: '로그아웃에 성공했습니다',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'JWT 인증 실패',
        schema: {
            example: {
                statusCode: 401,
                message: '유효하지 않거나 만료된 토큰입니다',
                error: 'Unauthorized',
            },
        },
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: '로그아웃', description: '로그아웃을 수행하고 세션을 무효화합니다.' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: '로그아웃에 성공했습니다.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '인증이 필요합니다.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map