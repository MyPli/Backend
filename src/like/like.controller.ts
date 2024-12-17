import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('좋아요') // Swagger 문서에서 '좋아요'라는 섹션으로 그룹화
@ApiBearerAuth() // JWT 인증이 필요함을 명시
@Controller('/playlists/:id/like')
@UseGuards(JwtAuthGuard) // JwtAuthGuard로 인증 적용
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @ApiOperation({
    summary: '좋아요 추가',
    description: '특정 플레이리스트에 좋아요를 추가합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '플레이리스트 ID',
    example: 1,
  })
  @ApiResponse({
    status: 201,
    description: '좋아요 추가 성공',
    schema: {
      example: {
        message: '좋아요를 추가했습니다.',
        playlistId: 1,
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증이 필요합니다.' })
  async addLike(
    @Param('id') playlistId: number,
    @Req() req: any,
  ): Promise<{ message: string; playlistId?: number }> {
    const userId = req.user?.userId; // 인증된 사용자 ID 가져오기
    if (!userId) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }
    return this.likeService.addLike(userId, playlistId);
  }

  @Delete()
  @ApiOperation({
    summary: '좋아요 해제',
    description: '특정 플레이리스트에 추가된 좋아요를 해제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '플레이리스트 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '좋아요 해제 성공',
    schema: {
      example: {
        message: '좋아요를 해제했습니다.',
        playlistId: 1,
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증이 필요합니다.' })
  async removeLike(
    @Param('id') playlistId: number,
    @Req() req: any,
  ): Promise<{ message: string; playlistId?: number }> {
    const userId = req.user?.userId; // 인증된 사용자 ID 가져오기
    if (!userId) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }
    return this.likeService.removeLike(userId, playlistId);
  }
}
