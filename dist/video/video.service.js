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
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const googleapis_1 = require("googleapis");
let VideoService = class VideoService {
    constructor(prisma) {
        this.prisma = prisma;
        this.youtube = googleapis_1.google.youtube({
            version: 'v3',
            auth: process.env.YOUTUBE_API_KEY,
        });
    }
    async addVideo(playlistId, dto, userId) {
        const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
        if (!playlist) {
            throw new common_1.NotFoundException(`Playlist with ID ${playlistId} not found.`);
        }
        if (playlist.userId !== userId) {
            throw new common_1.UnauthorizedException('You do not own this playlist.');
        }
        return this.prisma.video.create({
            data: {
                playlistId,
                youtubeId: dto.youtubeId,
                title: dto.title,
                channelName: dto.channelName,
                thumbnailUrl: dto.thumbnailUrl,
                duration: dto.duration,
                order: dto.order ?? 0,
            },
        });
    }
    async updateOrder(playlistId, dto, userId) {
        const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
        if (!playlist) {
            throw new common_1.NotFoundException(`Playlist with ID ${playlistId} not found.`);
        }
        if (playlist.userId !== userId) {
            throw new common_1.UnauthorizedException('You do not own this playlist.');
        }
        const updatePromises = dto.map((video) => this.prisma.video.update({
            where: { id: video.id },
            data: { order: video.order },
        }));
        return Promise.all(updatePromises);
    }
    async searchVideos(query) {
        if (!query.keyword) {
            throw new Error('검색 키워드가 필요합니다.');
        }
        const response = await this.youtube.search.list({
            part: ['snippet'],
            q: query.keyword,
            maxResults: query.maxResults || 5,
        });
        return response.data.items.map((item) => ({
            youtubeId: item.id.videoId,
            title: item.snippet.title,
            channelName: item.snippet.channelTitle,
            thumbnailUrl: item.snippet.thumbnails?.default?.url,
        }));
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VideoService);
//# sourceMappingURL=video.service.js.map