import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service'; // S3 서비스 의존성

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}
  // 회원 정보 조회
  async getUserProfile(userId: number) {
    if (!userId) {
      throw new Error('유저 아이디가 없습니다');
    }

    // 필요한 필드만 선택
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        nickname: true,
        profileImage: true,
      },
    });

    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다');
    }

    return user; // 필요한 정보만 반환
  }
  // 회원 탈퇴
  async deleteUser(userId: number) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: '회원탈퇴에 성공했습니다' };
  }

  // 유저 닉네임 업데이트
  async updateNickname(userId: number, nickname: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { nickname },
      select: { id: true, nickname: true, profileImage: true },
    });
  }

  // 프로필 사진 업데이트
  async updateProfileImage(
    userId: number,
    fileBuffer: Buffer,
    fileType: string,
  ) {
    const imageUrl = await this.s3Service.uploadImage(
      userId,
      fileBuffer,
      fileType,
    );

    return this.prisma.user.update({
      where: { id: userId },
      data: { profileImage: imageUrl },
      select: { id: true, nickname: true, profileImage: true },
    });
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
      coverImage: like.playlist.coverImage,
      description: like.playlist.description,
      tags: like.playlist.tags.map((playlistTag) => playlistTag.tag.name), // Tag의 name 속성을 매핑
    }));
  }
}
