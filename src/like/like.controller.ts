import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('playlists/:id/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // 좋아요 추가
  @Post()
  async addLike(@Param('id') playlistId: number): Promise<string> {
    const userId = 1; // 인증이 없으므로 하드코딩
    return this.likeService.addLike(userId, playlistId);
  }

  // 좋아요 해제
  @Delete()
  async removeLike(@Param('id') playlistId: number): Promise<string> {
    const userId = 1; // 인증이 없으므로 하드코딩
    return this.likeService.removeLike(userId, playlistId);
  }
}

@Controller('users/me/likes') // 새로운 경로로 컨트롤러 추가
export class UserLikesController {
  constructor(private readonly likeService: LikeService) {}

  // 좋아요 리스트 조회
  @Get()
  async getLikedPlaylists(): Promise<any[]> {
    const userId = 1; // 인증이 없으므로 하드코딩
    return this.likeService.getLikedPlaylists(userId);
  }
}
