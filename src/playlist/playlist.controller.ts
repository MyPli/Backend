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
import { ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

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
      example: [
        {
          id: 1,
          title: '인기 플레이리스트',
          description: '많은 사람들이 좋아한 플레이리스트',
          coverImage: 'https://example.com/cover.png',
          likes: 1000,
        },
      ],
    },
  })
  async getPopularPlaylists(@Query('limit') limit?: number) {
    const resultLimit = limit ? parseInt(limit.toString(), 10) : 5;
    const playlists = await this.playlistService.getPopularPlaylists(resultLimit);
    return playlists.map((playlist) => ({
      id: playlist.id,
      title: playlist.title,
      description: playlist.description,
      coverImage: playlist.coverImage,
      likes: playlist.likesCount,
    }));
  }
  

  @Get('latest')
  @Public()
  @ApiOperation({ summary: '최신 플레이리스트 반환', description: '최근에 생성된 플레이리스트를 반환합니다.' })
  @ApiQuery({ name: 'limit', required: false, description: '반환할 개수 (기본값: 5)' })
  @ApiResponse({
    status: 200,
    description: '최신 플레이리스트 반환 성공',
    schema: {
      example: [
        {
          id: 1,
          title: '최신 플레이리스트',
          description: '새로운 곡들로 구성된 플레이리스트',
          coverImage: 'https://example.com/cover.png',
          createdAt: '2024-06-17T00:00:00Z',
        },
      ],
    },
  })  
  async getLatestPlaylists(@Query('limit') limit?: number) {
    const resultLimit = limit ? parseInt(limit.toString(), 10) : 5;
    const playlists = await this.playlistService.getLatestPlaylists(resultLimit);
    return playlists.map((playlist) => ({
      id: playlist.id,
      title: playlist.title,
      description: playlist.description, // 추가
      coverImage: playlist.coverImage,   // 추가
      createdAt: playlist.createdAt,
    }));
  }  

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 플레이리스트 반환', description: '현재 로그인된 사용자의 플레이리스트를 반환합니다.' })
  @ApiQuery({ name: 'sort', required: false, description: '정렬 기준 (latest 또는 alphabetical)' })
  @ApiResponse({
    status: 200,
    description: '내 플레이리스트 반환 성공',
    schema: {
      example: [
        {
          id: 1,
          title: '내 플레이리스트',
          description: '내가 만든 최고의 플레이리스트',
          coverImage: 'https://example.com/cover.png',
          videos: [
            { id: 1, youtubeId: 'abc123', title: '동영상 제목', duration: 180 },
          ],
        },
      ],
    },
  })
  async getMyPlaylists(@Req() req, @Query() query: PlaylistSortDto) {
    const userId = req.user.userId;
    const playlists = await this.playlistService.getMyPlaylists(userId, query.sort || 'latest');
    return playlists.map((playlist) => ({
      id: playlist.id,
      title: playlist.title,
      description: playlist.description,
      coverImage: playlist.coverImage,
      videos: playlist.videos.map((video) => ({
        id: video.id,
        youtubeId: video.youtubeId,
        title: video.title,
        duration: video.duration,
      })),
    }));
  }
  
  
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '플레이리스트 상세 조회', description: '지정된 ID의 플레이리스트를 조회합니다.' })
  @ApiResponse({
    status: 200,
    description: '플레이리스트 상세 조회 성공',
    schema: {
      example: {
        id: 1,
        title: 'My Playlist',
        description: '공부할 때 듣기 좋은 음악',
        coverImage: 'https://img.youtube.com/vi/example/0.jpg',
        tags: ['공부', '집중'],
        createdBy: "Jhon Doe",
        totalTime: '01:25:30',
        videos: [
          {
            id: 101,
            title: '노래 제목',
            url: 'https://youtube.com/watch?v=example',
            thumbnailUrl: 'https://img.youtube.com/vi/example/0.jpg',
            artist: 'SMTOWN',
            time: '03:45',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 플레이리스트',
    schema: { example: { message: '플레이리스트를 찾을 수 없습니다.' } },
  })
  @ApiResponse({
    status: 401,
    description: '인증 오류',
    schema: { example: { message: '인증이 필요합니다.' } },
  })  
  async getPlaylistDetails(@Param('id') id: string): Promise<any> {
    const playlist = await this.playlistService.getPlaylistDetails(parseInt(id, 10));
    return playlist;
  }
    

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '플레이리스트 생성',
    description: `새로운 플레이리스트를 생성합니다.`,
  })
  @ApiResponse({
    status: 201,
    description: '플레이리스트 생성 성공',
    schema: {
      example: {
        id: 1,
        title: 'My Favorite Songs',
        description: '즐겨듣는 노래 모음',
        tags: ['Pop', 'K-Pop'],
        message: '플레이리스트 생성 성공',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '필수 데이터 누락',
    schema: { example: { message: '제목과 태그, 첫번째 비디오 값은 필수입니다.' } },
  })
  @ApiResponse({
    status: 401,
    description: '인증 오류',
    schema: { example: { message: '인증이 필요합니다.' } },
  })
  async createPlaylist(@Body() dto: CreatePlaylistDto, @Req() req): Promise<any> {
    const userId = req.user?.userId;
    const playlist = await this.playlistService.createPlaylist(dto, userId);
    return playlist;
  }
  
  

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '플레이리스트 수정', description: '지정된 ID의 플레이리스트를 수정합니다.' })
  @ApiResponse({
    status: 200,
    description: '플레이리스트 수정 성공',
    schema: {
      example: {
        id: 1,
        title: 'Updated Playlist Title',
        description: '업데이트된 설명',
        tags: ['업데이트', '새로운 태그'],
        message: '플레이리스트 수정 성공',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 플레이리스트',
    schema: { example: { message: '플레이리스트를 찾을 수 없습니다.' } },
  })
  @ApiResponse({
    status: 401,
    description: '인증 오류',
    schema: { example: { message: '인증이 필요합니다.' } },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 입력 데이터',
    schema: { example: { message: '입력값이 유효하지 않습니다.' } },
  })  
  async updatePlaylist(
    @Param('id') id: string,
    @Body() dto: UpdatePlaylistDto,
    @Req() req: Request,
  ): Promise<any> {
    const updatedPlaylist = await this.playlistService.updatePlaylist(parseInt(id, 10), req.user?.userId, dto);
    return {
      id: updatedPlaylist.id,
      title: updatedPlaylist.title,
      description: updatedPlaylist.description,
      tags: updatedPlaylist.tags, // 안전하게 반환
      message: '플레이리스트 수정 성공',
    };
  }  
  

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '플레이리스트 삭제',
    description: '지정된 ID의 플레이리스트를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '플레이리스트 삭제 성공',
    schema: {
      example: {
        id: 1, // 삭제된 플레이리스트의 ID
        message: '플레이리스트 삭제 성공',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '플레이리스트를 찾을 수 없습니다.',
    schema: {
      example: {
        message: '플레이리스트를 찾을 수 없습니다.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 오류',
    schema: {
      example: {
        message: '인증이 필요합니다.',
      },
    },
  })
  async deletePlaylist(@Param('id') id: string, @Req() req: Request): Promise<any> {
    const parsedId = parseInt(id, 10);
    const userId = req.user['userId'];
    const result = await this.playlistService.deletePlaylist(parsedId, userId);
    return result; // 서비스에서 반환된 결과를 그대로 반환
  }


  @Get('videos/search')
  @ApiOperation({ summary: '유튜브 동영상 검색', description: '유튜브 API를 통해 동영상을 검색합니다.' })
  @ApiQuery({ name: 'keyword', required: true, description: '검색 키워드' })
  @ApiQuery({ name: 'maxResults', required: false, description: '검색 결과 수 (기본값: 5)' })
  @ApiResponse({
    status: 200,
    description: '유튜브 동영상 검색 성공',
    schema: {
      example: [
        {
          youtubeId: 'abc123',
          title: '동영상 제목',
          channelName: '채널 이름',
          thumbnailUrl: 'https://example.com/thumbnail.jpg',
          duration: 180,
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: '검색어 누락',
    schema: { example: { message: '검색어는 필수입니다.' } },
  })
  @ApiResponse({
    status: 404,
    description: '검색 결과 없음',
    schema: { example: { message: '검색 결과를 찾을 수 없습니다.' } },
  })    
  async searchVideos(@Query() query: SearchVideoDto) {
    const videos = await this.videoService.searchVideos(query);
    return videos.map((video) => ({
      youtubeId: video.youtubeId,
      title: video.title,
      channelName: video.channelName,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
    }));
  }
  
  @Post(':id/videos')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: '플레이리스트에 곡 추가', 
    description: `기존 플레이리스트에 곡(비디오)를 추가합니다.<br>
                  동영상을 추가할 때 duration 필드는 선택 사항입니다.<br>
                  값을 제공하지 않아도 되며, 동영상의 길이(초 단위)를 입력하면 됩니다. <br>
                  order 값은 기존 비디오 수를 기준으로 순서가 설정됩니다.<br>
                  (1로 두어도 알아서 늘어납니다.)` })
  @ApiResponse({
    status: 201,
    description: '곡 추가 성공',
    schema: {
      example: {
        playlistId: 1,
        videoId: 101,
        title: 'aespa 에스파 Whiplash MV',
        url: 'https://youtube.com/watch?v=jWQx2f-CErU',
        thumbnailUrl: 'https://img.youtube.com/vi/jWQx2f-CErU/0.jpg',
        message: '곡 추가 성공',
        order: 1,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '필수 데이터 누락',
    schema: { example: { message: '유효한 동영상 데이터가 필요합니다.' } },
  })
  @ApiResponse({
    status: 404,
    description: '플레이리스트를 찾을 수 없습니다.',
    schema: { example: { message: '플레이리스트를 찾을 수 없습니다.' } },
  })
  @ApiResponse({
    status: 401,
    description: '인증 오류',
    schema: { example: { message: '인증이 필요합니다.' } },
  })
  async addVideoToPlaylist(
    @Param('id') playlistId: string,
    @Body() dto: AddVideoDto,
    @Req() req: Request,
  ) {
    const userId = req.user.userId;
    const video = await this.videoService.addVideoToPlaylist(parseInt(playlistId, 10), dto, userId);
    return {
      playlistId: parseInt(playlistId, 10),
      videoId: video.id,
      title: video.title,
      url: `https://youtube.com/watch?v=${video.youtubeId}`,
      thumbnailUrl: video.thumbnailUrl,
      message: '곡 추가 성공',
      order: video.order,
    };
  }
  
  
  @Delete(':id/videos/:videoId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '플레이리스트 곡 제거', description: '플레이리스트에서 특정 곡을 제거합니다.' })
  @ApiResponse({
    status: 200,
    description: '곡 제거 성공',
    schema: {
      example: {
        playlistId: 1,
        videoId: 101,
        message: '곡 제거 성공',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '곡 또는 플레이리스트를 찾을 수 없습니다.',
    schema: { example: { message: '곡을 찾을 수 없습니다.' } },
  })
  @ApiResponse({
    status: 401,
    description: '인증 오류',
    schema: { example: { message: '인증이 필요합니다.' } },
  })
  async removeVideo(@Param('id') id: string, @Param('videoId') videoId: string): Promise<any> {
    await this.playlistService.removeVideo(parseInt(id, 10), parseInt(videoId, 10));
    return {
      playlistId: parseInt(id, 10),
      videoId: parseInt(videoId, 10),
      message: '곡 제거 성공',
    };
  }  
}