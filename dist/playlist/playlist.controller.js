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
exports.PlaylistController = void 0;
const common_1 = require("@nestjs/common");
const playlist_service_1 = require("./playlist.service");
const create_playlist_dto_1 = require("./dto/create-playlist.dto");
const update_playlist_dto_1 = require("./dto/update-playlist.dto");
const sort_playlist_dto_1 = require("./dto/sort-playlist.dto");
const add_video_dto_1 = require("./dto/add-video.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const auth_decorator_1 = require("../auth/auth.decorator");
let PlaylistController = class PlaylistController {
    constructor(playlistService) {
        this.playlistService = playlistService;
    }
    async getPopularPlaylists(limit) {
        const resultLimit = limit ? parseInt(limit.toString(), 10) : 5;
        return this.playlistService.getPopularPlaylists(resultLimit);
    }
    async getLatestPlaylists(limit) {
        const resultLimit = limit ? parseInt(limit.toString(), 10) : 5;
        return this.playlistService.getLatestPlaylists(resultLimit);
    }
    async getMyPlaylists(req, query) {
        const userId = req.user.userId;
        return this.playlistService.getMyPlaylists(userId, query.sort || 'latest');
    }
    async getPlaylistDetails(id) {
        const parsedId = parseInt(id, 10);
        return this.playlistService.getPlaylistDetails(parsedId);
    }
    async createPlaylist(dto, req) {
        const userId = req.user?.userId;
        if (!userId)
            throw new common_1.UnauthorizedException('인증이 필요합니다.');
        return this.playlistService.createPlaylist(dto, userId);
    }
    async updatePlaylist(id, dto, req) {
        const parsedId = parseInt(id, 10);
        const userId = req.user?.userId;
        return this.playlistService.updatePlaylist(parsedId, userId, dto);
    }
    async deletePlaylist(id, req) {
        const parsedId = parseInt(id, 10);
        const userId = req.user['userId'];
        return this.playlistService.deletePlaylist(parsedId, userId);
    }
    async addVideo(id, dto) {
        const parsedId = parseInt(id, 10);
        return this.playlistService.addVideo(parsedId, dto);
    }
    async removeVideo(id, videoId) {
        const parsedPlaylistId = parseInt(id, 10);
        const parsedVideoId = parseInt(videoId, 10);
        return this.playlistService.removeVideo(parsedPlaylistId, parsedVideoId);
    }
};
exports.PlaylistController = PlaylistController;
__decorate([
    (0, common_1.Get)('popular'),
    (0, auth_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "getPopularPlaylists", null);
__decorate([
    (0, common_1.Get)('latest'),
    (0, auth_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "getLatestPlaylists", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, sort_playlist_dto_1.PlaylistSortDto]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "getMyPlaylists", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "getPlaylistDetails", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_playlist_dto_1.CreatePlaylistDto, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "createPlaylist", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_playlist_dto_1.UpdatePlaylistDto, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "updatePlaylist", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "deletePlaylist", null);
__decorate([
    (0, common_1.Post)(':id/videos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_video_dto_1.AddVideoDto]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "addVideo", null);
__decorate([
    (0, common_1.Delete)(':id/videos/:videoId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "removeVideo", null);
exports.PlaylistController = PlaylistController = __decorate([
    (0, common_1.Controller)('/playlists'),
    __metadata("design:paramtypes", [playlist_service_1.PlaylistService])
], PlaylistController);
//# sourceMappingURL=playlist.controller.js.map