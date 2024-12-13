import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  // 좋아요 추가
  async addLike(userId: number, playlistId: number): Promise<string> {
    // 플레이리스트 존재 여부 확인
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });
    if (!playlist) {
      throw new NotFoundException(`플레이리스트 ID ${playlistId}를 찾을 수 없습니다.`);
    }

    // 좋아요가 이미 있는지 확인
    const existingLike = await this.prisma.like.findFirst({
      where: { userId, playlistId },
    });
    if (existingLike) {
      return '이미 좋아요를 눌렀습니다.';
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

    return `플레이리스트 ID ${playlistId}에 좋아요를 추가했습니다.`;
  }

  // 좋아요 해제
  async removeLike(userId: number, playlistId: number): Promise<string> {
    // 좋아요 존재 여부 확인
    const existingLike = await this.prisma.like.findFirst({
      where: { userId, playlistId },
    });
    if (!existingLike) {
      return '좋아요를 누르지 않은 상태입니다.';
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

    return `플레이리스트 ID ${playlistId}의 좋아요를 해제했습니다.`;
  }

  // 좋아요한 플레이리스트 리스트 가져오기
  async getLikedPlaylists(userId: number): Promise<any[]> {
    const likes = await this.prisma.like.findMany({
      where: { userId },
      include: {
        playlist: {
          include: {
            tags: {
              include: {
                tag: true, // Tag 데이터를 포함하여 가져오기
              },
            },
          },
        },
      },
    });
  
    if (likes.length === 0) {
      throw new NotFoundException('좋아요한 플레이리스트가 없습니다.');
    }
  
    // 데이터 포맷 변경
    return likes.map((like) => ({
      id: like.playlist.id,
      title: like.playlist.title,
      description: like.playlist.description,
      tags: like.playlist.tags.map((playlistTag) => playlistTag.tag.name), // Tag의 name 속성을 매핑
    }));
  }
  
}
