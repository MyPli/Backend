import { Controller, Get, Query } from '@nestjs/common';
import { VideoService } from '../video/video.service';
import { SearchVideoDto } from '../video/dto/search-video.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

@Controller('/search')
export class SearchController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  @ApiOperation({
    summary: '서비스와 유튜브 동영상 검색',
    description: '서비스에 등록된 플레이리스트와 유튜브 동영상을 검색하여 결과를 반환합니다.',
  })
  @ApiQuery({
    name: 'keyword',
    description: '검색 키워드',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'maxResults',
    description: '검색 결과 최대 수 (기본값: 5)',
    type: Number,
    required: false,
  })
  @ApiResponse({
    status: 400,
    description: '검색 키워드 누락',
  })
  @ApiResponse({
    status: 200,
    description: '검색 결과 반환',
    schema: {
      example: {
        servicePlaylists: [
          {
            id: 1,
            title: '에스파 플레이리스트',
            description: '쇠맛 제대로 말아주는 에스파 노래모음',
            coverImage: 'https://example.com/image.png',
            source: 'service',
          },
        ],
        youtubePlaylists: [
          {
            youtubeId: 'NRvBivvvz6Q',
            title: '에스파 유튜브 플레이리스트',
            channelName: 'SMTOWN',
            thumbnailUrl: 'https://img.youtube.com/vi/NRvBivvvz6Q/default.jpg',
            source: 'youtube',
          },
        ],
      },
    },
  })
  async search(@Query() query: SearchVideoDto) {
    if (!query.keyword) {
      throw new BadRequestException('검색 키워드가 필요합니다.');
    }
    return this.videoService.searchServiceAndYoutube(query);
  }
}

