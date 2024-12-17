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
exports.SignupDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SignupDto {
}
exports.SignupDto = SignupDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'admin@mail.com',
        description: '사용자의 이메일 주소',
    }),
    (0, class_validator_1.IsEmail)({}, { message: '올바른 이메일 형식이어야 합니다.' }),
    __metadata("design:type", String)
], SignupDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'test1234',
        description: '사용자의 비밀번호',
    }),
    (0, class_validator_1.IsString)({ message: '비밀번호는 문자열이어야 합니다.' }),
    (0, class_validator_1.MinLength)(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' }),
    __metadata("design:type", String)
], SignupDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'admin',
        description: '사용자의 이름',
    }),
    (0, class_validator_1.IsString)({ message: '닉네임은 문자열이어야 합니다.' }),
    (0, class_validator_1.MinLength)(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' }),
    (0, class_validator_1.MaxLength)(20, { message: '닉네임은 최대 20자 이하이어야 합니다.' }),
    __metadata("design:type", String)
], SignupDto.prototype, "nickname", void 0);
//# sourceMappingURL=signup.dto.js.map