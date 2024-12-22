import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddVideoDto } from '../playlist/dto/add-video.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SearchVideoDto } from './dto/search-video.dto';
import { google } from 'googleapis';
import { cache } from '../utils/cache.util';

@Injectable()
export class VideoService {
  private readonly youtube;

  constructor(private readonly prisma: PrismaService) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY, // .env에서 YouTube API 키 가져오기
    });
  }

  // ISO 8601 문자열을 초 단위의 숫자로 변환하는 함수
  private parseDuration(duration: string): number {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/; // ISO 8601 패턴
    const matches = duration.match(regex);

    const hours = parseInt(matches?.[1] || '0', 10);
    const minutes = parseInt(matches?.[2] || '0', 10);
    const seconds = parseInt(matches?.[3] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds; // 초 단위로 변환
  }

  // 1. 유튜브 동영상 검색 - 음악 카테고리 및 duration 포함 + 로컬 캐시 추가
  async searchVideos(query: SearchVideoDto) {
    if (!query.keyword) {
      throw new Error('검색 키워드가 필요합니다.');
    }
  
    const cacheKey = `video_search:${query.keyword}:${query.maxResults || 5}`;
    const cachedResults = cache.get(cacheKey);
  
    if (cachedResults) {
      return cachedResults.map((result) => ({
        ...result,
        source: 'cache', // 로컬 캐시에서 가져온 경우
      }));
    }
  
    const searchResponse = await this.youtube.search.list({
      part: ['id'],
      q: query.keyword,
      maxResults: query.maxResults || 5,
      type: 'video',
      videoCategoryId: '10',
      videoEmbeddable: 'true',
    });
  
    const videoIds = searchResponse.data.items.map((item) => item.id.videoId);
  
    if (videoIds.length === 0) {
      return [];
    }
  
    const videoResponse = await this.youtube.videos.list({
      part: ['snippet', 'contentDetails'],
      id: videoIds.join(','),
    });
  
    const results = videoResponse.data.items.map((item) => ({
      youtubeId: item.id,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails?.default?.url,
      duration: this.parseDuration(item.contentDetails.duration),
      source: 'youtube', // 유튜브에서 가져온 경우
    }));
  
    cache.set(cacheKey, results, 3600); // TTL: 1시간
    return results;
  }

  // 2. 서비스와 유튜브 검색 결과 통합 - source 필드 추가
  async searchServiceAndYoutube(query: SearchVideoDto) {
    const cacheKey = `combined_search:${query.keyword}:${query.maxResults || 5}`;
    const cachedResults = cache.get(cacheKey);
  
    if (cachedResults) {
      return {
        ...cachedResults,
        youtubePlaylists: cachedResults.youtubePlaylists.map((video) => ({
          ...video,
          source: 'cache', // 로컬 캐시에서 가져온 경우
        })),
      };
    }
  
    const youtubeResults = await this.searchVideos(query);
  
    const serviceResults = await this.prisma.playlist.findMany({
      where: { title: { contains: query.keyword } },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
      },
    });
  
    const servicePlaylists = serviceResults.map((playlist) => ({
      ...playlist,
      source: 'service',
    }));
  
    const combinedResults = {
      servicePlaylists,
      youtubePlaylists: youtubeResults,
    };
  
    cache.set(cacheKey, combinedResults, 3600); // TTL: 1시간
    return combinedResults;
  }

  // 3. 유튜브 동영상의 duration 값 가져오기
  async fetchVideoDuration(youtubeId: string): Promise<number> {
    const response = await this.youtube.videos.list({
      part: ['contentDetails'],
      id: youtubeId,
    });

    const durationISO = response.data.items?.[0]?.contentDetails?.duration;
    if (!durationISO) throw new Error('유튜브 동영상 duration 값을 가져올 수 없습니다.');

    return this.parseDuration(durationISO); // ISO 8601 -> 초 변환
  }

  // 4. 플레이리스트에 동영상 추가 - duration 자동 가져오기, 맨 처음 추가된 경우 커버 이미지 설정
  async addVideoToPlaylist(playlistId: number, dto: AddVideoDto, userId: number): Promise<any> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
      include: { videos: true }, // 기존 비디오 정보 포함
    });
  
    if (!playlist) throw new NotFoundException(`Playlist with ID ${playlistId} not found.`);
    if (playlist.userId !== userId) throw new UnauthorizedException('You do not own this playlist.');
  
    // duration이 비어있을 경우 유튜브 API로 가져오기
    const duration = dto.duration || (await this.fetchVideoDuration(dto.youtubeId));
  
    // 새로운 비디오 추가
    const video = await this.prisma.video.create({
      data: {
        playlistId,
        youtubeId: dto.youtubeId,
        title: dto.title,
        channelName: dto.channelName,
        thumbnailUrl: dto.thumbnailUrl,
        duration: duration,
        order: playlist.videos.length + 1, // 기존 비디오 수를 기준으로 순서 설정
      },
    });
  
    // 만약 비디오가 첫 번째로 추가된 경우에만 커버 이미지를 설정
    if (playlist.videos.length === 0) {
      await this.prisma.playlist.update({
        where: { id: playlistId },
        data: { coverImage: dto.thumbnailUrl },
      });
    }
  
    // 반환 데이터 구성
    return {
      id: video.id, // 추가된 비디오의 ID
      youtubeId: video.youtubeId, // 유튜브 ID 추가
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      order: video.order,
    };
  }

  // 5. 플레이리스트 내 동영상 순서 업데이트
  async updateOrder(playlistId: number, dto: UpdateOrderDto[], userId: number) {
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${playlistId} not found.`);
    }
    if (playlist.userId !== userId) {
      throw new UnauthorizedException('You do not own this playlist.');
    }

    const updatePromises = dto.map((video) =>
      this.prisma.video.update({
        where: { id: video.id },
        data: { order: video.order },
      }),
    );

    return Promise.all(updatePromises);
  }
}
