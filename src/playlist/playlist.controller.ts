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
  } from '@nestjs/common';
  import { PlaylistService } from './playlist.service';
  import { CreatePlaylistDto } from './dto/create-playlist.dto';
  import { UpdatePlaylistDto } from './dto/update-playlist.dto';
  import { AddVideoDto } from './dto/add-video.dto';
  
  @Controller('playlists')
  @UsePipes(new ValidationPipe({ transform: true })) // ValidationPipe 추가
  export class PlaylistController {
    constructor(private readonly playlistService: PlaylistService) {}
  
    // 1. 플레이리스트 생성
    @Post()
    async createPlaylist(@Body() dto: CreatePlaylistDto): Promise<any> {
      const userId = 1; // 예제: 인증 없이 사용자 ID를 하드코딩
      return this.playlistService.createPlaylist(dto, userId);
    }
  
    // 2. 플레이리스트 수정
    @Patch(':id')
    async updatePlaylist(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdatePlaylistDto,
    ): Promise<any> {
      const userId = 1; // 예제: 인증 없이 사용자 ID를 하드코딩
      return this.playlistService.updatePlaylist(id, userId, dto); // 누락된 userId 추가
    }
  
    // 3. 플레이리스트 삭제
    @Delete(':id')
    async deletePlaylist(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<string> {
      const userId = 1; // 예제: 인증 없이 사용자 ID를 하드코딩
      return this.playlistService.deletePlaylist(id); 
    }
  
    // 4. 동영상 추가
    @Post(':id/videos')
    async addVideo(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: AddVideoDto,
    ): Promise<any> {
      return this.playlistService.addVideo(id, dto); // userId가 필요하지 않으므로 그대로 유지
    }
  }
  