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

@Controller('/playlists/:id/like')
@UseGuards(JwtAuthGuard) // JwtAuthGuard로 인증 적용
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // 좋아요 추가
  @Post()
  async addLike(@Param('id') playlistId: number, @Req() req: any): Promise<{ message: string; playlistId?: number }> {
    const userId = req.user?.userId; // 인증된 사용자 ID 가져오기
    if (!userId) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }
    return this.likeService.addLike(userId, playlistId);
  }

  // 좋아요 해제
  @Delete()
  async removeLike(@Param('id') playlistId: number, @Req() req: any): Promise<{ message: string; playlistId?: number }> {
    const userId = req.user?.userId; // 인증된 사용자 ID 가져오기
    if (!userId) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }
    return this.likeService.removeLike(userId, playlistId);
  }
}
