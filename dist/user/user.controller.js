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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUserProfile(req) {
        const userId = req.user.userId;
        return this.userService.getUserProfile(userId);
    }
    async updateNickname(req, nickname) {
        const userId = req.user.userId;
        if (!nickname) {
            throw new common_1.BadRequestException('닉네임이 필요합니다.');
        }
        const updatedUser = await this.userService.updateNickname(userId, nickname);
        return {
            message: '닉네임이 성공적으로 업데이트되었습니다.',
            user: updatedUser,
        };
    }
    async updateProfileImage(req, file) {
        const userId = req.user.userId;
        if (!file) {
            throw new common_1.BadRequestException('파일이 업로드되지 않았습니다.');
        }
        const fileType = file.mimetype.split('/')[1];
        const updatedUser = await this.userService.updateProfileImage(userId, file.buffer, fileType);
        return {
            message: '프로필 이미지가 성공적으로 업데이트되었습니다.',
            user: updatedUser,
        };
    }
    async deleteUser(req) {
        const userId = req.user.userId;
        return this.userService.deleteUser(userId);
    }
    async getLikedPlaylists(req) {
        const userId = req.user.userId;
        return this.userService.getLikedPlaylists(userId);
    }
};
exports.UserController = UserController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '내 정보 조회', description: 'JWT 토큰을 이용해 현재 사용자 정보를 가져옵니다.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '사용자 정보 반환',
        schema: {
            example: {
                email: 'admin@mail.com',
                nickname: 'admin',
                profileImage: 'http://example.com/profile.jpg',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '인증 실패',
        schema: {
            example: {
                statusCode: 401,
                message: '유효하지 않거나 만료된 토큰입니다',
                error: 'Unauthorized',
            },
        },
    }),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({
        summary: '내 프로필 조회',
        description: '현재 로그인한 사용자의 프로필을 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '프로필 조회 성공',
        schema: {
            example: {
                userId: 1,
                email: 'user@example.com',
                nickname: 'UserNickname',
                profileImage: 'https://example.com/image.png',
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '닉네임 변경', description: '사용자의 닉네임을 업데이트합니다.' }),
    (0, swagger_1.ApiBody)({
        description: '새로운 닉네임',
        schema: { example: { nickname: 'newNickname' } },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '닉네임이 성공적으로 업데이트됨',
        schema: {
            example: {
                message: '닉네임이 성공적으로 업데이트되었습니다.',
                user: {
                    id: 1,
                    nickname: 'newNickname',
                    profileImage: 'http://example.com/image.png',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '인증 실패',
        schema: {
            example: {
                statusCode: 401,
                message: '유효하지 않거나 만료된 토큰입니다',
                error: 'Unauthorized',
            },
        },
    }),
    (0, common_1.Patch)('me/nickname'),
    (0, swagger_1.ApiOperation)({
        summary: '닉네임 업데이트',
        description: '현재 사용자의 닉네임을 업데이트합니다.',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: { nickname: 'NewNickname' },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '닉네임 업데이트 성공',
        schema: {
            example: {
                message: '닉네임이 성공적으로 업데이트되었습니다.',
                user: { userId: 1, nickname: 'NewNickname' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '닉네임이 필요합니다.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('nickname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateNickname", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '프로필 이미지 업로드',
        description: '사용자의 프로필 이미지를 파일 형식으로 업로드하고 업데이트합니다.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '프로필 이미지가 성공적으로 업데이트됨',
        schema: {
            example: {
                message: '프로필 이미지가 성공적으로 업데이트되었습니다.',
                user: {
                    id: 1,
                    nickname: 'updatedNickname',
                    profileImage: 'http://example.com/new-image.png',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '인증 실패',
        schema: {
            example: {
                statusCode: 401,
                message: '유효하지 않거나 만료된 토큰입니다',
                error: 'Unauthorized',
            },
        },
    }),
    (0, common_1.Patch)('me/profile-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({
        summary: '프로필 이미지 업데이트',
        description: '현재 사용자의 프로필 이미지를 업데이트합니다.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: '업로드할 이미지 파일',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '프로필 이미지 업데이트 성공',
        schema: {
            example: {
                message: '프로필 이미지가 성공적으로 업데이트되었습니다.',
                user: { userId: 1, profileImage: 'https://example.com/image.png' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '파일이 업로드되지 않았습니다.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfileImage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '회원 탈퇴', description: '사용자 계정을 삭제합니다.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '회원탈퇴 성공',
        schema: {
            example: {
                message: '회원탈퇴에 성공했습니다',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '인증 실패',
        schema: {
            example: {
                statusCode: 401,
                message: '유효하지 않거나 만료된 토큰입니다',
                error: 'Unauthorized',
            },
        },
    }),
    (0, common_1.Delete)('me'),
    (0, swagger_1.ApiOperation)({
        summary: '회원 탈퇴',
        description: '현재 사용자의 계정을 삭제합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '회원 탈퇴 성공',
        schema: {
            example: {
                message: '계정이 성공적으로 삭제되었습니다.',
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '좋아요한 플레이리스트 조회',
        description: '사용자가 좋아요한 플레이리스트를 조회합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '좋아요한 플레이리스트 목록 반환',
        schema: {
            example: [
                {
                    id: 1,
                    title: 'Chill Vibes',
                    description: 'A playlist for relaxing.',
                    tags: ['chill', 'relax', 'vibe'],
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '인증 실패',
        schema: {
            example: {
                statusCode: 401,
                message: '유효하지 않거나 만료된 토큰입니다',
                error: 'Unauthorized',
            },
        },
    }),
    (0, common_1.Get)('me/likes'),
    (0, swagger_1.ApiOperation)({
        summary: '좋아요한 플레이리스트 조회',
        description: '현재 사용자가 좋아요한 플레이리스트 목록을 반환합니다.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '좋아요한 플레이리스트 조회 성공',
        schema: {
            example: [
                {
                    id: 1,
                    title: 'Chill Vibes',
                    description: '편안한 음악 모음',
                    coverImage: 'https://example.com/image1.png',
                },
                {
                    id: 2,
                    title: 'Workout Mix',
                    description: '운동할 때 듣기 좋은 플레이리스트',
                    coverImage: 'https://example.com/image2.png',
                },
            ],
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getLikedPlaylists", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('사용자'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('/users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map