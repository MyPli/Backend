import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
import { VideoService } from '../video/video.service';
import { SearchVideoDto } from '../video/dto/search-video.dto';
import { AddVideoDto } from './dto/add-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Public } from 'src/auth/auth.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('플레이리스트') // Swagger 그룹화
@ApiBearerAuth()
@Controller('/playlists')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly videoService: VideoService,
  ) {}

  @Get('popular')
  @Public()
  @ApiOperation({ summary: '인기 플레이리스트 반환', description: '좋아요 수가 많은 인기 플레이리스트를 반환합니다.' })
  @ApiQuery({ name: 'limit', required: false, description: '반환할 개수 (기본값: 5)' })
  @ApiResponse({
    status: 200,
    description: '인기 플레이리스트 반환 성공',
    schema: {
      example: [{ id: 1, title: '인기 플레이리스트', likes: 1000 }],
    },
  })
  async getPopularPlaylists(@Query('limit') limit?: number) {
    const resultLimit = limit ? parseInt(limit.toString(), 10) : 5;
    return this.playlistService.getPopularPlaylists(resultLimit);
  }

  @Get('latest')
  @Public()
  @ApiOperation({ summary: '최신 플레이리스트 반환', description: '최근에 생성된 플레이리스트를 반환합니다.' })
  @ApiQuery({ name: 'limit', required: false, description: '반환할 개수 (기본값: 5)' })
  @ApiResponse({
    status: 200,
    description: '최신 플레이리스트 반환 성공',
    schema: {
      example: [{ id: 1, title: '최신 플레이리스트', createdAt: '2024-06-17T00:00:00Z' }],
    },
  })
  async getLatestPlaylists(@Query('limit') limit?: number) {
    const resultLimit = limit ? parseInt(limit.toString(), 10) : 5;
    return this.playlistService.getLatestPlaylists(resultLimit);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 플레이리스트 반환', description: '현재 로그인된 사용자의 플레이리스트를 반환합니다.' })
  @ApiQuery({ name: 'sort', required: false, description: '정렬 기준 (latest 또는 alphabetical)' })
  @ApiResponse({
    status: 200,
    description: '내 플레이리스트 반환 성공',
    schema: { example: [{ id: 1, title: '내 플레이리스트', videos: [] }] },
  })
  async getMyPlaylists(@Req() req, @Query() query: PlaylistSortDto) {
    const userId = req.user.userId;
    return this.playlistService.getMyPlaylists(userId, query.sort || 'latest');
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '플레이리스트 상세 조회', description: '지정된 ID의 플레이리스트를 조회합니다.' })
  @ApiResponse({
    status: 200,
    description: '플레이리스트 상세 조회 성공',
    schema: { example: { id: 1, title: '플레이리스트 제목', videos: [] } },
  })
  async getPlaylistDetails(@Param('id') id: string): Promise<any> {
    const parsedId = parseInt(id, 10);
    return this.playlistService.getPlaylistDetails(parsedId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '플레이리스트 생성', description: '새로운 플레이리스트를 생성합니다.' })
  @ApiResponse({
    status: 201,
    description: '플레이리스트 생성 성공',
    schema: { example: { id: 1, title: '새 플레이리스트' } },
  })
  async createPlaylist(@Body() dto: CreatePlaylistDto, @Req() req): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('인증이 필요합니다.');
    return this.playlistService.createPlaylist(dto, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '플레이리스트 수정', description: '지정된 ID의 플레이리스트를 수정합니다.' })
  @ApiResponse({ status: 200, description: '플레이리스트 수정 성공' })
  async updatePlaylist(
    @Param('id') id: string,
    @Body() dto: UpdatePlaylistDto,
    @Req() req: Request,
  ): Promise<any> {
    const parsedId = parseInt(id, 10);
    const userId = req.user?.userId;
    return this.playlistService.updatePlaylist(parsedId, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '플레이리스트 삭제', description: '지정된 ID의 플레이리스트를 삭제합니다.' })
  @ApiResponse({ status: 200, description: '플레이리스트 삭제 성공' })
  async deletePlaylist(@Param('id') id: string, @Req() req: Request): Promise<string> {
    const parsedId = parseInt(id, 10);
    const userId = req.user['userId'];
    return this.playlistService.deletePlaylist(parsedId, userId);
  }

  @Get('videos/search')
  @ApiOperation({ summary: '유튜브 동영상 검색', description: '유튜브 API를 통해 동영상을 검색합니다.' })
  @ApiQuery({ name: 'keyword', required: true, description: '검색 키워드' })
  @ApiQuery({ name: 'maxResults', required: false, description: '검색 결과 수 (기본값: 5)' })
  async searchVideos(@Query() query: SearchVideoDto) {
    return this.videoService.searchVideos(query);
  }

  @Post(':id/videos')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '플레이리스트에 동영상 추가', description: '검색된 동영상을 플레이리스트에 추가합니다.' })
  @ApiResponse({ status: 201, description: '동영상 추가 성공' })
  async addVideoToPlaylist(
    @Param('id') playlistId: string,
    @Body() dto: AddVideoDto,
    @Req() req: Request,
  ) {
    const userId = req.user.userId;
    const parsedId = parseInt(playlistId, 10);
    return this.videoService.addVideoToPlaylist(parsedId, dto, userId);
  }

  @Delete(':id/videos/:videoId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '플레이리스트 곡 제거', description: '플레이리스트에서 특정 곡을 제거합니다.' })
  @ApiResponse({ status: 200, description: '곡 제거 성공' })
  async removeVideo(@Param('id') id: string, @Param('videoId') videoId: string): Promise<any> {
    const parsedPlaylistId = parseInt(id, 10);
    const parsedVideoId = parseInt(videoId, 10);
    return this.playlistService.removeVideo(parsedPlaylistId, parsedVideoId);
  }
}
