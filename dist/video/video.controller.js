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
exports.VideoController = void 0;
const common_1 = require("@nestjs/common");
const video_service_1 = require("./video.service");
const create_video_dto_1 = require("./dto/create-video.dto");
const search_video_dto_1 = require("./dto/search-video.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let VideoController = class VideoController {
    constructor(videoService) {
        this.videoService = videoService;
    }
    async addVideo(playlistId, dto, req) {
        const userId = req.user.userId;
        return this.videoService.addVideo(playlistId, dto, userId);
    }
    async updateOrder(playlistId, dto, req) {
        const userId = req.user.userId;
        return this.videoService.updateOrder(playlistId, dto, userId);
    }
    async searchVideos(query) {
        return this.videoService.searchVideos(query);
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Post)(':playlistId'),
    __param(0, (0, common_1.Param)('playlistId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_video_dto_1.CreateVideoDto, Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "addVideo", null);
__decorate([
    (0, common_1.Patch)(':playlistId/order'),
    __param(0, (0, common_1.Param)('playlistId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiQuery)({ name: 'keyword', required: true, description: '검색 키워드' }),
    (0, swagger_1.ApiQuery)({ name: 'maxResults', required: false, description: '검색 결과 수 (기본값: 5)', type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_video_dto_1.SearchVideoDto]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "searchVideos", null);
exports.VideoController = VideoController = __decorate([
    (0, common_1.Controller)('videos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], VideoController);
//# sourceMappingURL=video.controller.js.map