import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  // 좋아요 추가
  async addLike(userId: number, playlistId: number):  Promise<{ message: string; playlistId?: number }> {
    // 플레이리스트 존재 여부 확인
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });
    if (!playlist) {
      throw new NotFoundException(
        `플레이리스트 ID ${playlistId}를 찾을 수 없습니다.`,
      );
    }

    // 좋아요가 이미 있는지 확인
    const existingLike = await this.prisma.like.findFirst({
      where: { userId, playlistId },
    });
    if (existingLike) {
      return {
        message : '이미 좋아요를 누른 상태입니다',
      };
    }

    // 좋아요 추가
    await this.prisma.like.create({
      data: {
        userId,
        playlistId,
      },
    });

    // 좋아요 카운트 증가
    await this.prisma.playlist.update({
      where: { id: playlistId },
      data: { likesCount: { increment: 1 } },
    });

    return {
      message: '좋아요 등록에 성공했습니다',
      playlistId : playlistId
    };
  }

  // 좋아요 해제
  async removeLike(userId: number, playlistId: number): Promise<{ message: string; playlistId?: number }> {
    // 좋아요 존재 여부 확인
    const existingLike = await this.prisma.like.findFirst({
      where: { userId, playlistId },
    });
    if (!existingLike) {
      return {
        message: '좋아요를 누르지 않은 상태입니다.'
      };
    }

    // 좋아요 삭제
    await this.prisma.like.delete({
      where: { id: existingLike.id },
    });

    // 좋아요 카운트 감소
    await this.prisma.playlist.update({
      where: { id: playlistId },
      data: { likesCount: { decrement: 1 } },
    });

    return {
      message: '좋아요 해제에 성공했습니다',
      playlistId : playlistId
    };
  }

}
