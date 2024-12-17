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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('/users')
@ApiBearerAuth() // JWT 인증 적용
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '내 정보 조회', description: 'JWT 토큰을 이용해 현재 사용자 정보를 가져옵니다.' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 반환',
    schema: {
      example: {
        email: 'admin@mail.com',
        nickname: 'admin',
        profileImage: 'http://example.com/profile.jpg',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      example: {
        statusCode: 401,
        message: '유효하지 않거나 만료된 토큰입니다',
        error: 'Unauthorized',
      },
    },
  })
  @Get('me')
  async getUserProfile(@Req() req) {
    const userId = req.user.userId;
    return this.userService.getUserProfile(userId);
  }

  @ApiOperation({ summary: '닉네임 변경', description: '사용자의 닉네임을 업데이트합니다.' })
  @ApiBody({
    description: '새로운 닉네임',
    schema: { example: { nickname: 'newNickname' } },
  })
  // 닉네임 변경 API 수정
  @ApiResponse({
    status: 200,
    description: '닉네임이 성공적으로 업데이트됨',
    schema: {
      example: {
        message: '닉네임이 성공적으로 업데이트되었습니다.',
        user: {
          id: 1,
          nickname: 'newNickname',
          profileImage: 'http://example.com/image.png',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      example: {
        statusCode: 401,
        message: '유효하지 않거나 만료된 토큰입니다',
        error: 'Unauthorized',
      },
    },
  })
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

   @ApiOperation({
    summary: '프로필 이미지 업로드',
    description: '사용자의 프로필 이미지를 파일 형식으로 업로드하고 업데이트합니다.',
  })
  @ApiConsumes('multipart/form-data') // Swagger에서 파일 업로드 형식 지원
  @ApiResponse({
    status: 200,
    description: '프로필 이미지가 성공적으로 업데이트됨',
    schema: {
      example: {
        message: '프로필 이미지가 성공적으로 업데이트되었습니다.',
        user: {
          id: 1,
          nickname: 'updatedNickname',
          profileImage: 'http://example.com/new-image.png',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      example: {
        statusCode: 401,
        message: '유효하지 않거나 만료된 토큰입니다',
        error: 'Unauthorized',
      },
    },
  })
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

  @ApiOperation({ summary: '회원 탈퇴', description: '사용자 계정을 삭제합니다.' })
  @ApiResponse({
    status: 200,
    description: '회원탈퇴 성공',
    schema: {
      example: {
        message: '회원탈퇴에 성공했습니다',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      example: {
        statusCode: 401,
        message: '유효하지 않거나 만료된 토큰입니다',
        error: 'Unauthorized',
      },
    },
  })
  @Delete('me')
  async deleteUser(@Req() req) {
    const userId = req.user.userId;
    return this.userService.deleteUser(userId);
  }

  @ApiOperation({
    summary: '좋아요한 플레이리스트 조회',
    description: '사용자가 좋아요한 플레이리스트를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '좋아요한 플레이리스트 목록 반환',
    schema: {
      example: [
        {
          id: 1,
          title: 'Chill Vibes',
          description: 'A playlist for relaxing.',
          tags: ['chill', 'relax', 'vibe'],
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      example: {
        statusCode: 401,
        message: '유효하지 않거나 만료된 토큰입니다',
        error: 'Unauthorized',
      },
    },
  })
  // 좋아요 리스트 조회
  @Get('me/likes')
  async getLikedPlaylists(@Req() req: any): Promise<any[]> {
    const userId = req.user.userId; // 인증된 사용자 ID 가져오기
    return this.userService.getLikedPlaylists(userId);
  }
}
