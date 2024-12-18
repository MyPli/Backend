import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth() 
@Controller('/playlists/:id/like')
@UseGuards(JwtAuthGuard) 
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // 좋아요 추가
  @ApiOperation({ summary: '좋아요 추가', description: '플레이리스트에 좋아요를 추가합니다.' })
  @ApiParam({
    name: 'id',
    description: '좋아요를 추가할 플레이리스트의 ID',
    example: 123,
  })
  @ApiResponse({
    status: 201,
    description: '좋아요가 성공적으로 추가되었습니다.',
    schema: {
      example: {
        message: '좋아요 등록에 성공했습니다.',
        playlistId: 123,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '이미 좋아요가 추가된 상태입니다.',
    schema: {
      example: {
        message: '이미 좋아요를 누른 상태입니다',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 오류',
    schema: {
      example: {
        statusCode: 401,
        message: '인증이 필요합니다.',
        error: 'Unauthorized',
      },
    },
  })
  @Post()
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

  // 좋아요 해제
  @ApiOperation({ summary: '좋아요 해제', description: '플레이리스트에 추가된 좋아요를 해제합니다.' })
  @ApiParam({
    name: 'id',
    description: '좋아요를 해제할 플레이리스트의 ID',
    example: 123,
  })
  @ApiResponse({
    status: 200,
    description: '좋아요가 성공적으로 해제되었습니다.',
    schema: {
      example: {
        message: '좋아요 해제에 성공했습니다.',
        playlistId: 123,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 오류',
    schema: {
      example: {
        statusCode: 401,
        message: '인증이 필요합니다.',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '좋아요 또는 플레이리스트를 찾을 수 없습니다.',
    schema: {
      example: {
        statusCode: 404,
        message: '좋아요를 찾을 수 없습니다.',
        error: 'Not Found',
      },
    },
  })
  @Delete()
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
