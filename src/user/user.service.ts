import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service'; // S3 서비스 의존성

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

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

  async deleteUser(userId: number) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: '회원탈퇴에 성공했습니다' };
  }

  // user.service.ts
  async updateNickname(userId: number, nickname: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { nickname },
      select: { id: true, nickname: true, profileImage: true },
    });
  }

  // user.service.ts
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
}
