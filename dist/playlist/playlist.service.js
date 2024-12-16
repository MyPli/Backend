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
exports.PlaylistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const googleapis_1 = require("googleapis");
let PlaylistService = class PlaylistService {
    constructor(prisma) {
        this.prisma = prisma;
        this.youtube = googleapis_1.google.youtube({
            version: 'v3',
            auth: process.env.YOUTUBE_API_KEY,
        });
    }
    async createPlaylist(dto, userId) {
        if (!userId) {
            throw new Error('유효하지 않은 사용자입니다.');
        }
        const { title, description, tags } = dto;
        const playlist = await this.prisma.playlist.create({
            data: {
                title,
                description,
                user: {
                    connect: { id: userId },
                },
            },
        });
        if (tags && tags.length > 0) {
            await Promise.all(tags.map(async (tag) => {
                await this.prisma.playlistTag.create({
                    data: {
                        playlist: { connect: { id: playlist.id } },
                        tag: {
                            connectOrCreate: {
                                where: { name: tag },
                                create: { name: tag },
                            },
                        },
                    },
                });
            }));
        }
        return playlist;
    }
    async updatePlaylist(id, userId, dto) {
        const { title, description, tags } = dto;
        const playlist = await this.prisma.playlist.findUnique({
            where: { id },
            include: { tags: true },
        });
        if (!playlist) {
            throw new common_1.NotFoundException(`플레이리스트를 찾을 수 없습니다.`);
        }
        if (playlist.userId !== userId) {
            throw new common_1.UnauthorizedException('수정 권한이 없습니다.');
        }
        const updatedPlaylist = await this.prisma.playlist.update({
            where: { id },
            data: { title, description },
        });
        if (tags && tags.length > 0) {
            await this.prisma.playlistTag.deleteMany({ where: { playlistId: id } });
            await Promise.all(tags.map(async (tag) => {
                await this.prisma.playlistTag.create({
                    data: {
                        playlist: { connect: { id } },
                        tag: {
                            connectOrCreate: {
                                where: { name: tag },
                                create: { name: tag },
                            },
                        },
                    },
                });
            }));
        }
        return updatedPlaylist;
    }
    async deletePlaylist(id, userId) {
        const playlist = await this.prisma.playlist.findUnique({ where: { id } });
        if (!playlist || playlist.userId !== userId) {
            throw new common_1.UnauthorizedException('삭제 권한이 없습니다.');
        }
        await this.prisma.video.deleteMany({
            where: { playlistId: id },
        });
        await this.prisma.playlistTag.deleteMany({
            where: { playlistId: id },
        });
        await this.prisma.like.deleteMany({
            where: { playlistId: id },
        });
        await this.prisma.playlist.delete({ where: { id } });
        return `플레이리스트 ID ${id} 삭제 완료`;
    }
    async addVideo(playlistId, dto) {
        const { youtubeId, title, channelName, thumbnailUrl, duration, order } = dto;
        const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
        if (!playlist) {
            throw new common_1.NotFoundException(`ID ${playlistId}를 찾을 수 없습니다.`);
        }
        const video = await this.prisma.video.create({
            data: {
                playlistId,
                youtubeId,
                title,
                channelName,
                thumbnailUrl,
                duration,
                order: order ?? 0,
            },
        });
        return video;
    }
    async getPlaylistDetails(id) {
        const playlist = await this.prisma.playlist.findUnique({
            where: { id },
            include: {
                tags: true,
                videos: {
                    select: {
                        id: true,
                        title: true,
                        youtubeId: true,
                        thumbnailUrl: true,
                    },
                },
            },
        });
        if (!playlist) {
            throw new common_1.NotFoundException(`플레이리스트를 찾을 수 없습니다.`);
        }
        return {
            ...playlist,
            videos: playlist.videos.map((video) => ({
                id: video.id,
                title: video.title,
                url: `https://youtube.com/watch?v=${video.youtubeId}`,
            })),
        };
    }
    async removeVideo(playlistId, videoId) {
        const video = await this.prisma.video.findUnique({ where: { id: videoId } });
        if (!video || video.playlistId !== playlistId) {
            throw new common_1.NotFoundException(`비디오 ID ${videoId}를 찾을 수 없습니다.`);
        }
        await this.prisma.video.delete({ where: { id: videoId } });
        return {
            playlistId,
            videoId,
            message: '곡 제거 성공',
        };
    }
    async getPopularPlaylists(limit) {
        return this.prisma.playlist.findMany({
            orderBy: { likesCount: 'desc' },
            take: limit,
            select: {
                id: true,
                title: true,
                description: true,
                coverImage: true,
                likesCount: true,
                createdAt: true,
            },
        });
    }
    async getLatestPlaylists(limit) {
        return this.prisma.playlist.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                title: true,
                description: true,
                coverImage: true,
                likesCount: true,
                createdAt: true,
            },
        });
    }
};
exports.PlaylistService = PlaylistService;
exports.PlaylistService = PlaylistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlaylistService);
//# sourceMappingURL=playlist.service.js.map