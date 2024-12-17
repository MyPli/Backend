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
exports.User = void 0;
const swagger_1 = require("@nestjs/swagger");
class User {
}
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: '사용자의 고유 ID' }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com', description: '사용자의 이메일 주소' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'nickname123', description: '사용자의 닉네임' }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/profile-image.png',
        description: '사용자의 프로필 이미지 URL',
    }),
    __metadata("design:type", String)
], User.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'email',
        description: '사용자 인증 제공자 (예: email, google)',
    }),
    __metadata("design:type", String)
], User.prototype, "authProvider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-01T12:00:00Z', description: '계정 생성 일자' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-10T12:00:00Z', description: '계정 마지막 업데이트 일자' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
//# sourceMappingURL=user.entity.js.map