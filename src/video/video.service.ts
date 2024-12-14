import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SearchVideoDto } from './dto/search-video.dto';
import { google } from 'googleapis';

@Injectable()
export class VideoService {
  private readonly youtube;

  constructor(private readonly prisma: PrismaService) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY, // .env에서 YouTube API 키를 가져오기
    });
  }

  // 동영상 추가
  async addVideo(playlistId: number, dto: CreateVideoDto, userId: number) {
    // 플레이리스트 확인 및 소유권 검증
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${playlistId} not found.`);
    }
    if (playlist.userId !== userId) {
      throw new UnauthorizedException('You do not own this playlist.');
    }

    // 동영상 추가
    return this.prisma.video.create({
      data: {
        playlistId,
        youtubeId: dto.youtubeId,
        title: dto.title,
        channelName: dto.channelName,
        thumbnailUrl: dto.thumbnailUrl,
        duration: dto.duration,
        order: dto.order ?? 0,
      },
    });
  }

  // 플레이리스트 내 동영상 순서 업데이트
  async updateOrder(playlistId: number, dto: UpdateOrderDto[], userId: number) {
    // 플레이리스트 확인 및 소유권 검증
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${playlistId} not found.`);
    }
    if (playlist.userId !== userId) {
      throw new UnauthorizedException('You do not own this playlist.');
    }

    // 동영상 순서 업데이트
    const updatePromises = dto.map((video) =>
      this.prisma.video.update({
        where: { id: video.id },
        data: { order: video.order },
      }),
    );

    return Promise.all(updatePromises);
  }

  // YouTube 검색 (소유권 확인 필요 없음)
  async searchVideos(query: SearchVideoDto) {
    if (!query.keyword) {
      throw new Error('검색 키워드가 필요합니다.'); // 기본적인 유효성 검사
    }

    const response = await this.youtube.search.list({
      part: ['snippet'],
      q: query.keyword,
      maxResults: query.maxResults || 5,
    });

    return response.data.items.map((item) => ({
      youtubeId: item.id.videoId,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails?.default?.url,
    }));
  }
}
