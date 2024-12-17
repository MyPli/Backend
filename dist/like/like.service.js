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
exports.LikeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LikeService = class LikeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addLike(userId, playlistId) {
        const playlist = await this.prisma.playlist.findUnique({
            where: { id: playlistId },
        });
        if (!playlist) {
            throw new common_1.NotFoundException(`플레이리스트 ID ${playlistId}를 찾을 수 없습니다.`);
        }
        const existingLike = await this.prisma.like.findFirst({
            where: { userId, playlistId },
        });
        if (existingLike) {
            return {
                message: '이미 좋아요를 누른 상태입니다',
            };
        }
        await this.prisma.like.create({
            data: {
                userId,
                playlistId,
            },
        });
        await this.prisma.playlist.update({
            where: { id: playlistId },
            data: { likesCount: { increment: 1 } },
        });
        return {
            message: '좋아요 등록에 성공했습니다',
            playlistId: playlistId
        };
    }
    async removeLike(userId, playlistId) {
        const existingLike = await this.prisma.like.findFirst({
            where: { userId, playlistId },
        });
        if (!existingLike) {
            return {
                message: '좋아요를 누르지 않은 상태입니다.'
            };
        }
        await this.prisma.like.delete({
            where: { id: existingLike.id },
        });
        await this.prisma.playlist.update({
            where: { id: playlistId },
            data: { likesCount: { decrement: 1 } },
        });
        return {
            message: '좋아요 해제에 성공했습니다',
            playlistId: playlistId
        };
    }
};
exports.LikeService = LikeService;
exports.LikeService = LikeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikeService);
//# sourceMappingURL=like.service.js.map