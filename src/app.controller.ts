// import { Controller, Get, Post, Put, Delete, Param, Body, Query, UnauthorizedException } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery, ApiResponse, ApiUnauthorizedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
//
// @ApiTags('Playlist Service')
// @Controller('playlist')
// export class AppController {
//   constructor(private readonly appService: AppService) {}
//
//   // 1. 플레이리스트 생성
//   @Post()
//   @ApiOperation({ summary: '플레이리스트 생성' })
//   @ApiBody({ description: '생성할 플레이리스트 정보', schema: { example: { title: '나만의 플레이리스트', description: '공부할 때 듣기 좋은 노래' } } })
//   @ApiResponse({ status: 201, description: '플레이리스트가 성공적으로 생성되었습니다.' })
//   @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자입니다.' })
//   async createPlaylist(@Body() body: any, userId: number): Promise<any> {
//     if (!userId) {
//       throw new UnauthorizedException('인증되지 않은 사용자입니다.');
//     }
//     return await this.appService.createPlaylist(body, userId);
//   }
//
//   // 2. 플레이리스트 재생
//   @Get(':id/play')
//   @ApiOperation({ summary: '특정 플레이리스트를 재생' })
//   @ApiParam({ name: 'id', description: '플레이리스트 ID' })
//   @ApiResponse({ status: 200, description: '플레이리스트 재생 중입니다.' })
//   @ApiNotFoundResponse({ description: '플레이리스트를 찾을 수 없습니다.' })
//   async playPlaylist(@Param('id') id: number): Promise<string> {
//     return await this.appService.playPlaylist(id);
//   }
//
//   // 3. 다른 사람의 플레이리스트 좋아요 기능
//   @Put(':id/like')
//   @ApiOperation({ summary: '플레이리스트 좋아요 추가' })
//   @ApiParam({ name: 'id', description: '플레이리스트 ID' })
//   @ApiResponse({ status: 200, description: '플레이리스트에 좋아요가 추가되었습니다.' })
//   @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자입니다.' })
//   @ApiNotFoundResponse({ description: '플레이리스트를 찾을 수 없습니다.' })
//   async likePlaylist(@Param('id') id: number, userId: number): Promise<string> {
//     if (!userId) {
//       throw new UnauthorizedException('인증되지 않은 사용자입니다.');
//     }
//     return await this.appService.likePlaylist(id, userId);
//   }
//
//   // 4. 플레이리스트 및 사용자 검색 기능
//   @Get('search')
//   @ApiOperation({ summary: '플레이리스트 또는 사용자 검색' })
//   @ApiQuery({ name: 'keyword', description: '검색 키워드 (#차분한노래, 사용자 이름 등)' })
//   @ApiResponse({ status: 200, description: '검색 결과 반환.' })
//   async search(@Query('keyword') keyword: string): Promise<any[]> {
//     return await this.appService.search(keyword);
//   }
//
//   // 5. 로그인 (소셜 로그인 - 구글)
//   @Post('auth/login')
//   @ApiOperation({ summary: '구글 소셜 로그인' })
//   @ApiResponse({ status: 200, description: '로그인이 성공적으로 처리되었습니다.' })
//   async login(): Promise<string> {
//     return await this.appService.login();
//   }
//
//   // 6. 회원가입
//   @Post('auth/register')
//   @ApiOperation({ summary: '회원가입' })
//   @ApiBody({ description: '회원가입 정보', schema: { example: { email: 'test@example.com', password: 'password123', nickname: '사용자이름' } } })
//   @ApiResponse({ status: 201, description: '회원가입이 성공적으로 처리되었습니다.' })
//   async register(@Body() body: any): Promise<any> {
//     return await this.appService.register(body);
//   }
//
//   // 7. 로그아웃
//   @Post('auth/logout')
//   @ApiOperation({ summary: '로그아웃' })
//   @ApiResponse({ status: 200, description: '로그아웃이 성공적으로 처리되었습니다.' })
//   async logout(): Promise<string> {
//     return await this.appService.logout();
//   }
//
//   // 8. 마이페이지 - 프로필 이미지 수정
//   @Put('my/profile-image')
//   @ApiOperation({ summary: '프로필 이미지 수정' })
//   @ApiBody({ description: '프로필 이미지 데이터', schema: { example: { imageUrl: 'https://example.com/new-image.png' } } })
//   @ApiResponse({ status: 200, description: '프로필 이미지가 성공적으로 수정되었습니다.' })
//   @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자입니다.' })
//   async updateProfileImage(@Body() body: any, userId: number): Promise<any> {
//     if (!userId) {
//       throw new UnauthorizedException('인증되지 않은 사용자입니다.');
//     }
//     return await this.appService.updateProfileImage(userId, body);
//   }
//
//   // 9. 마이페이지 - 플레이리스트 수정
//   @Put('my/playlist/:id')
//   @ApiOperation({ summary: '마이페이지 플레이리스트 수정' })
//   @ApiParam({ name: 'id', description: '플레이리스트 ID' })
//   @ApiBody({ description: '수정할 플레이리스트 정보', schema: { example: { title: '수정된 플레이리스트 제목', description: '수정된 설명' } } })
//   @ApiResponse({ status: 200, description: '플레이리스트가 성공적으로 수정되었습니다.' })
//   @ApiUnauthorizedResponse({ description: '수정할 권한이 없습니다.' })
//   async updatePlaylist(@Param('id') id: number, @Body() body: any, userId: number): Promise<any> {
//     if (!userId) {
//       throw new UnauthorizedException('인증되지 않은 사용자입니다.');
//     }
//     return await this.appService.updatePlaylist(id, userId, body);
//   }
//
//   // 10. 마이페이지 - 플레이리스트 삭제
//   @Delete('my/playlist/:id')
//   @ApiOperation({ summary: '마이페이지 플레이리스트 삭제' })
//   @ApiParam({ name: 'id', description: '플레이리스트 ID' })
//   @ApiResponse({ status: 200, description: '플레이리스트가 성공적으로 삭제되었습니다.' })
//   @ApiUnauthorizedResponse({ description: '삭제할 권한이 없습니다.' })
//   async deletePlaylist(@Param('id') id: number, userId: number): Promise<string> {
//     if (!userId) {
//       throw new UnauthorizedException('인증되지 않은 사용자입니다.');
//     }
//     return await this.appService.deletePlaylist(id, userId);
//   }
//
//   // 11. 좋아요한 플레이리스트 보기
//   @Get('my/likes')
//   @ApiOperation({ summary: '좋아요한 플레이리스트 보기' })
//   @ApiResponse({ status: 200, description: '좋아요한 플레이리스트 목록을 반환합니다.' })
//   @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자입니다.' })
//   async getLikedPlaylists(userId: number): Promise<any[]> {
//     if (!userId) {
//       throw new UnauthorizedException('인증되지 않은 사용자입니다.');
//     }
//     return await this.appService.getLikedPlaylists(userId);
//   }
//
//   // 12. 플레이리스트 공유
//   @Get(':id/share')
//   @ApiOperation({ summary: '플레이리스트 공유 링크 생성' })
//   @ApiParam({ name: 'id', description: '플레이리스트 ID' })
//   @ApiResponse({ status: 200, description: '플레이리스트 공유 링크가 생성되었습니다.' })
//   @ApiNotFoundResponse({ description: '플레이리스트를 찾을 수 없습니다.' })
//   async sharePlaylist(@Param('id') id: number): Promise<string> {
//     return await this.appService.sharePlaylist(id);
//   }
// }
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
