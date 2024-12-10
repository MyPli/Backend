import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  private prisma = new PrismaClient();
  getHello(): string {
    return 'Hello World!';
  }
  // // 1. 플레이리스트 생성
  // async createPlaylist(data: any, userId: number): Promise<any> {
  //   if (!data.title || !data.description) {
  //     throw new BadRequestException('플레이리스트 제목과 설명을 모두 입력해주세요.');
  //   }
  //   return await this.prisma.playlist.create({
  //     data: {
  //       title: data.title,
  //       description: data.description,
  //       userId: userId,
  //     },
  //   });
  // }
  //
  // // 2. 플레이리스트 재생
  // async playPlaylist(id: number): Promise<string> {
  //   const playlist = await this.prisma.playlist.findUnique({ where: { id } });
  //   if (!playlist) {
  //     throw new NotFoundException(`플레이리스트 ID ${id}를 찾을 수 없습니다.`);
  //   }
  //   return `플레이리스트 '${playlist.title}' 재생 중입니다.`;
  // }
  //
  // // 3. 플레이리스트 좋아요 기능
  // async likePlaylist(playlistId: number, userId: number): Promise<string> {
  //   // 플레이리스트가 존재하는지 확인
  //   const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
  //   if (!playlist) {
  //     throw new NotFoundException(`플레이리스트 ID ${playlistId}를 찾을 수 없습니다.`);
  //   }
  //
  //   // 이미 좋아요를 눌렀는지 확인
  //   const existingLike = await this.prisma.userPlaylistLikes.findUnique({
  //     where: {
  //       userId_playlistId: {
  //         userId: userId,
  //         playlistId: playlistId,
  //       },
  //     },
  //   });
  //
  //   if (existingLike) {
  //     throw new BadRequestException(`이미 플레이리스트 ID ${playlistId}에 좋아요를 눌렀습니다.`);
  //   }
  //
  //   // 좋아요 추가
  //   await this.prisma.userPlaylistLikes.create({
  //     data: {
  //       userId: userId,
  //       playlistId: playlistId,
  //     },
  //   });
  //
  //   return `플레이리스트 ID ${playlistId}에 좋아요를 추가했습니다.`;
  // }
  //
  // // 4. 검색 기능
  // async search(keyword: string): Promise<any[]> {
  //   if (!keyword) {
  //     throw new BadRequestException('검색 키워드를 입력해주세요.');
  //   }
  //   return await this.prisma.playlist.findMany({
  //     where: {
  //       OR: [
  //         { title: { contains: keyword } },
  //         { description: { contains: keyword } },
  //       ],
  //     },
  //   });
  // }
  //
  // // 5. 로그인
  // async login(): Promise<string> {
  //   // 로그인 처리는 실제로 구글 OAuth 등 인증 처리가 필요하므로 구현 예정
  //   return '로그인이 성공적으로 처리되었습니다.';
  // }
  //
  // // 6. 회원가입
  // async register(data: any): Promise<any> {
  //   if (!data.email || !data.password || !data.nickname) {
  //     throw new BadRequestException('이메일, 비밀번호, 닉네임을 모두 입력해주세요.');
  //   }
  //   const newUser = await this.prisma.user.create({
  //     data: {
  //       email: data.email,
  //       password: data.password,
  //       nickname: data.nickname,
  //     },
  //   });
  //   return newUser;
  // }
  //
  // // 7. 로그아웃
  // async logout(): Promise<string> {
  //   return '성공적으로 로그아웃되었습니다.';
  // }
  //
  // // 8. 프로필 이미지 수정
  // async updateProfileImage(userId: number, data: any): Promise<any> {
  //   if (!data.imageUrl) {
  //     throw new BadRequestException('이미지 URL을 입력해주세요.');
  //   }
  //   const updatedUser = await this.prisma.user.update({
  //     where: { id: userId },
  //     data: {
  //       profileImage: data.imageUrl,
  //     },
  //   });
  //   return updatedUser;
  // }
  //
  // // 9. 플레이리스트 수정
  // async updatePlaylist(id: number, userId: number, data: any): Promise<any> {
  //   const playlist = await this.prisma.playlist.findUnique({ where: { id } });
  //   if (!playlist) {
  //     throw new NotFoundException(`플레이리스트 ID ${id}를 찾을 수 없습니다.`);
  //   }
  //   if (playlist.userId !== userId) {
  //     throw new UnauthorizedException('이 플레이리스트를 수정할 권한이 없습니다.');
  //   }
  //
  //   if (!data.title || !data.description) {
  //     throw new BadRequestException('제목과 설명을 모두 입력해주세요.');
  //   }
  //
  //   const updatedPlaylist = await this.prisma.playlist.update({
  //     where: { id },
  //     data: {
  //       title: data.title,
  //       description: data.description,
  //     },
  //   });
  //   return updatedPlaylist;
  // }
  //
  // // 10. 플레이리스트 삭제
  // async deletePlaylist(id: number, userId: number): Promise<string> {
  //   const playlist = await this.prisma.playlist.findUnique({ where: { id } });
  //   if (!playlist) {
  //     throw new NotFoundException(`플레이리스트 ID ${id}를 찾을 수 없습니다.`);
  //   }
  //   if (playlist.userId !== userId) {
  //     throw new UnauthorizedException('이 플레이리스트를 삭제할 권한이 없습니다.');
  //   }
  //
  //   await this.prisma.playlist.delete({ where: { id } });
  //   return `플레이리스트 ID ${id}가 삭제되었습니다.`;
  // }
  //
  // // 11. 좋아요한 플레이리스트 보기
  // async getLikedPlaylists(userId: number): Promise<any[]> {
  //   const likedPlaylists = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //     select: {
  //       likes: true,
  //     },
  //   });
  //
  //   if (!likedPlaylists) {
  //     throw new NotFoundException('좋아요한 플레이리스트를 찾을 수 없습니다.');
  //   }
  //   return likedPlaylists.likes;
  // }
  //
  // // 12. 플레이리스트 공유
  // async sharePlaylist(id: number): Promise<string> {
  //   const playlist = await this.prisma.playlist.findUnique({ where: { id } });
  //   if (!playlist) {
  //     throw new NotFoundException(`플레이리스트 ID ${id}를 찾을 수 없습니다.`);
  //   }
  //   return `https://mypli.com/playlist/${id} 링크를 공유하세요.`;
  // }
}
