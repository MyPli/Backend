import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Query,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddVideoDto } from './dto/add-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('/playlists')
@UsePipes(new ValidationPipe({ transform: true }))

export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  // 1. 플레이리스트 생성
// 현재 컨트롤러
@Post()
@UseGuards(JwtAuthGuard) // JWT 인증 적용
async createPlaylist(@Body() dto: CreatePlaylistDto, @Req() req): Promise<any> {
  const userId = req.user?.userId; // 인증 토큰에서 userId 추출
  if (!userId) {
    throw new UnauthorizedException('인증이 필요합니다.');
  }
  return this.playlistService.createPlaylist(dto, userId);
}


  // 2. 플레이리스트 수정
  @Patch(':id')
  @UseGuards(JwtAuthGuard) // JWT 인증 적용
  async updatePlaylist(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlaylistDto,
    @Req() req: Request, // 요청 객체
  ): Promise<any> {
    const userId = req.user?.userId; // req.user에서 userId 추출
    console.log('Request User ID in Controller:', userId);
  
    if (!userId) {
      throw new UnauthorizedException('수정 권한이 없습니다.');
    }
  
    return this.playlistService.updatePlaylist(id, userId, dto);
  }
  
  // 3. 플레이리스트 삭제
  @Delete(':id')
  @UseGuards(JwtAuthGuard) // JWT 인증 적용
  async deletePlaylist(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<string> {
    const userId = req.user['userId']; // 수정: 'id'가 아닌 'userId'
    console.log('Authenticated User ID:', userId);
    return this.playlistService.deletePlaylist(id, userId);
  }
  

  // 4. 동영상 추가
  @Post(':id/videos')
  @UseGuards(JwtAuthGuard) // JWT 인증 적용
  async addVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddVideoDto,
  ): Promise<any> {
    return this.playlistService.addVideo(id, dto);
  }

  // 5. 플레이리스트 상세 조회
  @Get(':id')
  @UseGuards(JwtAuthGuard) // JWT 인증 적용
  async getPlaylistDetails(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.playlistService.getPlaylistDetails(id);
  }

  // 6. 플레이리스트 곡 제거
  @Delete(':id/videos/:videoId')
  @UseGuards(JwtAuthGuard) // JWT 인증 적용
  async removeVideo(
    @Param('id', ParseIntPipe) playlistId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
  ): Promise<any> {
    return this.playlistService.removeVideo(playlistId, videoId);
  }

  // 인기 플레이리스트 반환
  @Get('popular')
  async getPopularPlaylists(@Query('limit') limit?: number) {
    const resultLimit = limit ? parseInt(limit.toString(), 10) : 5; // 기본값 5
    const playlists = await this.playlistService.getPopularPlaylists(resultLimit);
    return { playlists };
  }

  // 최신 플레이리스트 반환
  @Get('latest')
  async getLatestPlaylists(@Query('limit') limit?: number) {
    const resultLimit = limit ? parseInt(limit.toString(), 10) : 5; // 기본값 5
    const playlists = await this.playlistService.getLatestPlaylists(resultLimit);
    return { playlists };
  }

  // 내 플레이리스트 가져오기 (정렬 기능 포함)
  @UseGuards(JwtAuthGuard) // 인증이 필요한 경우
  @Get('me')
  async getMyPlaylists(
    @Req() req, // 인증된 사용자 정보
    @Query('sort') sort?: 'latest' | 'alphabetical', // 정렬 기준: 최신순 또는 가나다순
  ) {
    const userId = req.user.userId; // 로그인된 사용자 ID
    const playlists = await this.playlistService.getMyPlaylists(userId, sort || 'latest'); // 기본값: 최신순
    return { playlists };
  }
}

