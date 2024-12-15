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
            return '이미 좋아요를 눌렀습니다.';
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
        return `플레이리스트 ID ${playlistId}에 좋아요를 추가했습니다.`;
    }
    async removeLike(userId, playlistId) {
        const existingLike = await this.prisma.like.findFirst({
            where: { userId, playlistId },
        });
        if (!existingLike) {
            return '좋아요를 누르지 않은 상태입니다.';
        }
        await this.prisma.like.delete({
            where: { id: existingLike.id },
        });
        await this.prisma.playlist.update({
            where: { id: playlistId },
            data: { likesCount: { decrement: 1 } },
        });
        return `플레이리스트 ID ${playlistId}의 좋아요를 해제했습니다.`;
    }
    async getLikedPlaylists(userId) {
        const likes = await this.prisma.like.findMany({
            where: { userId },
            include: {
                playlist: {
                    include: {
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                },
            },
        });
        if (likes.length === 0) {
            throw new common_1.NotFoundException('좋아요한 플레이리스트가 없습니다.');
        }
        return likes.map((like) => ({
            id: like.playlist.id,
            title: like.playlist.title,
            description: like.playlist.description,
            tags: like.playlist.tags.map((playlistTag) => playlistTag.tag.name),
        }));
    }
};
exports.LikeService = LikeService;
exports.LikeService = LikeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikeService);
//# sourceMappingURL=like.service.js.map