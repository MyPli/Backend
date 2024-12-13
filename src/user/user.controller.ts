import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserProfile(@Req() req) {
    const userId = req.user.userId;
    return this.userService.getUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/nickname')
  async updateNickname(@Req() req, @Body('nickname') nickname: string) {
    const userId = req.user.userId;
    if (!nickname) {
      throw new BadRequestException('닉네임이 필요합니다.');
    }
    const updatedUser = await this.userService.updateNickname(userId, nickname);
    return {
      message: '닉네임이 성공적으로 업데이트되었습니다.',
      user: updatedUser,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.userId;
    if (!file) {
      throw new BadRequestException('파일이 업로드되지 않았습니다.');
    }
    const fileType = file.mimetype.split('/')[1];
    const updatedUser = await this.userService.updateProfileImage(
      userId,
      file.buffer,
      fileType,
    );
    return {
      message: '프로필 이미지가 성공적으로 업데이트되었습니다.',
      user: updatedUser,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteUser(@Req() req) {
    const userId = req.user.userId;
    return this.userService.deleteUser(userId);
  }
}
