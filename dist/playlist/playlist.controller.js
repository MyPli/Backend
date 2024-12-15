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
const add_video_dto_1 = require("./dto/add-video.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PlaylistController = class PlaylistController {
    constructor(playlistService) {
        this.playlistService = playlistService;
    }
    async createPlaylist(dto, req) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('인증이 필요합니다.');
        }
        return this.playlistService.createPlaylist(dto, userId);
    }
    async updatePlaylist(id, dto, req) {
        const userId = req.user?.userId;
        console.log('Request User ID in Controller:', userId);
        if (!userId) {
            throw new common_1.UnauthorizedException('수정 권한이 없습니다.');
        }
        return this.playlistService.updatePlaylist(id, userId, dto);
    }
    async deletePlaylist(id, req) {
        const userId = req.user['userId'];
        console.log('Authenticated User ID:', userId);
        return this.playlistService.deletePlaylist(id, userId);
    }
    async addVideo(id, dto) {
        return this.playlistService.addVideo(id, dto);
    }
    async getPlaylistDetails(id) {
        return this.playlistService.getPlaylistDetails(id);
    }
    async removeVideo(playlistId, videoId) {
        return this.playlistService.removeVideo(playlistId, videoId);
    }
};
exports.PlaylistController = PlaylistController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_playlist_dto_1.CreatePlaylistDto, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "createPlaylist", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_playlist_dto_1.UpdatePlaylistDto, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "updatePlaylist", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "deletePlaylist", null);
__decorate([
    (0, common_1.Post)(':id/videos'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, add_video_dto_1.AddVideoDto]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "addVideo", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "getPlaylistDetails", null);
__decorate([
    (0, common_1.Delete)(':id/videos/:videoId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('videoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "removeVideo", null);
exports.PlaylistController = PlaylistController = __decorate([
    (0, common_1.Controller)('playlists'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [playlist_service_1.PlaylistService])
], PlaylistController);
//# sourceMappingURL=playlist.controller.js.map