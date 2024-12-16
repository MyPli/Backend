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

@Controller('api/playlists')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard) // JWT 인증 적용
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  // 1. 플레이리스트 생성
// 현재 컨트롤러
@Post()
async createPlaylist(@Body() dto: CreatePlaylistDto, @Req() req): Promise<any> {
  const userId = req.user?.userId; // 인증 토큰에서 userId 추출
  if (!userId) {
    throw new UnauthorizedException('인증이 필요합니다.');
  }
  return this.playlistService.createPlaylist(dto, userId);
}


  // 2. 플레이리스트 수정
  @Patch(':id')
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
  async addVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddVideoDto,
  ): Promise<any> {
    return this.playlistService.addVideo(id, dto);
  }

  // 5. 플레이리스트 상세 조회
  @Get(':id')
  async getPlaylistDetails(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.playlistService.getPlaylistDetails(id);
  }

  // 6. 플레이리스트 곡 제거
  @Delete(':id/videos/:videoId')
  async removeVideo(
    @Param('id', ParseIntPipe) playlistId: number,
    @Param('videoId', ParseIntPipe) videoId: number,
  ): Promise<any> {
    return this.playlistService.removeVideo(playlistId, videoId);
  }
}
