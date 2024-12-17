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
exports.LikeController = void 0;
const common_1 = require("@nestjs/common");
const like_service_1 = require("./like.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let LikeController = class LikeController {
    constructor(likeService) {
        this.likeService = likeService;
    }
    async addLike(playlistId, req) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('인증이 필요합니다.');
        }
        return this.likeService.addLike(userId, playlistId);
    }
    async removeLike(playlistId, req) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('인증이 필요합니다.');
        }
        return this.likeService.removeLike(userId, playlistId);
    }
};
exports.LikeController = LikeController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '좋아요 추가', description: '플레이리스트에 좋아요를 추가합니다.' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '좋아요가 성공적으로 추가되었습니다.',
        schema: {
            example: {
                message: '좋아요가 추가되었습니다.',
                playlistId: 123,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: '이미 좋아요가 추가된 상태입니다.',
        schema: {
            example: {
                message: '이미 좋아요를 누른 상태입니다',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '인증 오류',
        schema: {
            example: {
                statusCode: 401,
                message: '인증이 필요합니다.',
                error: 'Unauthorized',
            },
        },
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "addLike", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '좋아요 해제', description: '플레이리스트에 추가된 좋아요를 해제합니다.' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '좋아요가 성공적으로 해제되었습니다.',
        schema: {
            example: {
                message: '좋아요가 해제되었습니다.',
                playlistId: 123,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: '인증 오류',
        schema: {
            example: {
                statusCode: 401,
                message: '인증이 필요합니다.',
                error: 'Unauthorized',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: '좋아요 또는 플레이리스트를 찾을 수 없습니다.',
        schema: {
            example: {
                statusCode: 404,
                message: '좋아요를 찾을 수 없습니다.',
                error: 'Not Found',
            },
        },
    }),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "removeLike", null);
exports.LikeController = LikeController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('/playlists/:id/like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [like_service_1.LikeService])
], LikeController);
//# sourceMappingURL=like.controller.js.map