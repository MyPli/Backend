import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  BadRequestException,
  Query,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlaylistSortDto } from './dto/sort-playlist.dto';
import { AddVideoDto } from './dto/add-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Public } from 'src/auth/auth.decorator';

@Controller('/playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  // 1. 인기 플레이리스트 반환
  @Get('popular')
  @Public()
  async getPopularPlaylists(@Query('limit') limit?: number) {
    const resultLimit = limit ? parseInt(limit.toString(), 10) : 5;
    return this.playlistService.getPopularPlaylists(resultLimit);
  }

  // 2. 최신 플레이리스트 반환
  @Get('latest')
  @Public()
  async getLatestPlaylists(@Query('limit') limit?: number) {
    const resultLimit = limit ? parseInt(limit.toString(), 10) : 5;
    return this.playlistService.getLatestPlaylists(resultLimit);
  }

  // 3. 내 플레이리스트 반환
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyPlaylists(@Req() req, @Query() query: PlaylistSortDto) {
    const userId = req.user.userId;
    return this.playlistService.getMyPlaylists(userId, query.sort || 'latest');
  }

  // 4. 플레이리스트 상세 조회 - 숫자 ID만 허용
  @Get(':id') // /playlists/:id (숫자만)
  @UseGuards(JwtAuthGuard)
  async getPlaylistDetails(@Param('id') id: string): Promise<any> {
    const parsedId = parseInt(id, 10);
    return this.playlistService.getPlaylistDetails(parsedId);
  }

  // 5. 플레이리스트 생성
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPlaylist(@Body() dto: CreatePlaylistDto, @Req() req): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('인증이 필요합니다.');
    return this.playlistService.createPlaylist(dto, userId);
  }

  // 6. 플레이리스트 수정
  @Patch(':id') // /playlists/:id
  @UseGuards(JwtAuthGuard)
  async updatePlaylist(
    @Param('id') id: string,
    @Body() dto: UpdatePlaylistDto,
    @Req() req: Request,
  ): Promise<any> {
    const parsedId = parseInt(id, 10);
    const userId = req.user?.userId;
    return this.playlistService.updatePlaylist(parsedId, userId, dto);
  }

  // 7. 플레이리스트 삭제
  @Delete(':id') // /playlists/:id
  @UseGuards(JwtAuthGuard)
  async deletePlaylist(@Param('id') id: string, @Req() req: Request): Promise<string> {
    const parsedId = parseInt(id, 10);
    const userId = req.user['userId'];
    return this.playlistService.deletePlaylist(parsedId, userId);
  }

  // 8. 동영상 추가
  @Post(':id/videos') // /playlists/:id/videos
  @UseGuards(JwtAuthGuard)
  async addVideo(@Param('id') id: string, @Body() dto: AddVideoDto): Promise<any> {
    const parsedId = parseInt(id, 10);
    return this.playlistService.addVideo(parsedId, dto);
  }

  // 9. 플레이리스트 곡 제거
  @Delete(':id/videos/:videoId') // /playlists/:id/videos/:videoId
  @UseGuards(JwtAuthGuard)
  async removeVideo(
    @Param('id') id: string,
    @Param('videoId') videoId: string,
  ): Promise<any> {
    const parsedPlaylistId = parseInt(id, 10);
    const parsedVideoId = parseInt(videoId, 10);
    return this.playlistService.removeVideo(parsedPlaylistId, parsedVideoId);
  }
}
