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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const s3_service_1 = require("../s3/s3.service");
let UserService = class UserService {
    constructor(prisma, s3Service) {
        this.prisma = prisma;
        this.s3Service = s3Service;
    }
    async getUserProfile(userId) {
        if (!userId) {
            throw new Error('유저 아이디가 없습니다');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                nickname: true,
                profileImage: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('해당 유저를 찾을 수 없습니다');
        }
        return user;
    }
    async deleteUser(userId) {
        await this.prisma.user.delete({
            where: { id: userId },
        });
        return { message: '회원탈퇴에 성공했습니다' };
    }
    async updateNickname(userId, nickname) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { nickname },
            select: { id: true, nickname: true, profileImage: true },
        });
    }
    async updateProfileImage(userId, fileBuffer, fileType) {
        const imageUrl = await this.s3Service.uploadImage(userId, fileBuffer, fileType);
        return this.prisma.user.update({
            where: { id: userId },
            data: { profileImage: imageUrl },
            select: { id: true, nickname: true, profileImage: true },
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service])
], UserService);
//# sourceMappingURL=user.service.js.map