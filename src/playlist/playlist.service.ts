import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VideoService } from '../video/video.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddVideoDto } from './dto/add-video.dto';
import { google } from 'googleapis';
import { Prisma } from '@prisma/client';
@Injectable()
export class PlaylistService {
  private readonly youtube;

  constructor(
    private readonly prisma: PrismaService,
    private readonly videoService: VideoService, // VideoService 주입
  ) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });
  }

  // 1. 플레이리스트 생성
  async createPlaylist(dto: CreatePlaylistDto, userId: number): Promise<any> {
    const { title, description, tags = [] } = dto;
  
    // 태그 유효성 검사
    const validatedTags = tags.filter((tag) => tag && tag.trim() !== "");
  
    const playlist = await this.prisma.playlist.create({
      data: {
        title,
        description,
        user: { connect: { id: userId } },
        tags: {
          create: validatedTags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { name: tag },
                create: { name: tag },
              },
            },
          })),
        },
      },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });
  
    return {
      id: playlist.id,
      title: playlist.title,
      description: playlist.description,
      tags: playlist.tags.map((playlistTag) => playlistTag.tag.name),
      message: "플레이리스트 생성 성공",
    };
  }
  
  
  // 2. 플레이리스트 수정
  async updatePlaylist(id: number, userId: number, dto: UpdatePlaylistDto): Promise<any> {
    const { title, description, tags = [], videos = [] } = dto;

    const playlist = await this.prisma.playlist.findUnique({
        where: { id },
        include: { tags: true, videos: true },
    });

    if (!playlist) {
        throw new NotFoundException(`플레이리스트를 찾을 수 없습니다.`);
    }

    if (playlist.userId !== userId) {
        throw new UnauthorizedException('수정 권한이 없습니다.');
    }

    // 태그 유효성 검사 및 업데이트
    const validatedTags = tags.filter((tag) => tag && tag.trim() !== '');
    await this.prisma.playlist.update({
        where: { id },
        data: { title, description },
    });

    await this.prisma.playlistTag.deleteMany({ where: { playlistId: id } });
    await Promise.all(
        validatedTags.map(async (tag) => {
            await this.prisma.playlistTag.create({
                data: {
                    playlist: { connect: { id } },
                    tag: {
                        connectOrCreate: {
                            where: { name: tag },
                            create: { name: tag },
                        },
                    },
                },
            });
        }),
    );

    // 비디오 처리: 이전 데이터 삭제 및 새로운 데이터 삽입
    await this.prisma.video.deleteMany({ where: { playlistId: id } });

    await Promise.all(
        videos.map(async (video, index) => {
            const duration = video.duration || (await this.videoService.fetchVideoDuration(video.youtubeId));
            await this.prisma.video.create({
                data: {
                    playlistId: id,
                    youtubeId: video.youtubeId,
                    title: video.title,
                    channelName: video.channelName,
                    thumbnailUrl: video.thumbnailUrl,
                    duration: duration,
                    order: index + 1,
                },
            });
        }),
    );

    const updatedPlaylist = await this.prisma.playlist.findUnique({
        where: { id },
        include: {
            tags: { include: { tag: true } },
            videos: true,
        },
    });

    return {
        id: updatedPlaylist.id,
        title: updatedPlaylist.title,
        description: updatedPlaylist.description,
        tags: updatedPlaylist.tags.map((tag) => tag.tag.name),
        videos: updatedPlaylist.videos.map((video) => ({
            id: video.id,
            youtubeId: video.youtubeId,
            title: video.title,
            channelName: video.channelName,
            thumbnailUrl: video.thumbnailUrl,
            duration: video.duration,
            order: video.order,
        })),
        message: '플레이리스트 수정 성공',
    };
}
  

  // 3. 플레이리스트 삭제
  async deletePlaylist(id: number, userId: number): Promise<{ id: number; message: string }> {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
  
    if (!playlist || playlist.userId !== userId) {
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    }
  
    // 1. 동영상 삭제
    await this.prisma.video.deleteMany({
      where: { playlistId: id },
    });
  
    // 2. 태그 연결 삭제
    await this.prisma.playlistTag.deleteMany({
      where: { playlistId: id },
    });
  
    // 3. 좋아요 데이터 삭제
    await this.prisma.like.deleteMany({
      where: { playlistId: id },
    });
  
    // 4. 플레이리스트 삭제
    await this.prisma.playlist.delete({ where: { id } });
  
    return {
      id,
      message: '플레이리스트 삭제 성공',
    };
  }
  

  // 4. 동영상 추가
  async addVideo(playlistId: number, dto: AddVideoDto): Promise<any> {
    const { youtubeId, title, channelName, thumbnailUrl, duration, order } = dto;
  
    if (!youtubeId || youtubeId.trim() === "") {
      throw new BadRequestException("유효한 YouTube ID가 필요합니다."); // youtubeId 필수 확인
    }
  
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException(`ID ${playlistId}를 찾을 수 없습니다.`);
    }
  
    const video = await this.prisma.video.create({
      data: {
        playlistId,
        youtubeId: youtubeId.trim(), // youtubeId 공백 제거 후 저장
        title,
        channelName,
        thumbnailUrl,
        duration,
        order: order ?? 0,
      },
    });
  
    return video;
  }
  

  // 5. 플레이리스트 상세 조회
  async getPlaylistDetails(id: number, userId: number): Promise<any> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: {
        user: { select: { nickname: true, id: true } }, // 닉네임과 사용자 ID 가져오기
        tags: { include: { tag: { select: { name: true } } } }, // 태그 이름 가져오기
        videos: {
          select: {
            id: true,
            youtubeId: true,
            title: true,
            thumbnailUrl: true,
            duration: true, // 비디오 길이
            channelName: true, // 아티스트로 사용할 채널 이름
          },
        },
        likes: {
          select: {
            userId: true, // 좋아요를 누른 사용자 ID 가져오기
          },
        },
      },
    });
  
    if (!playlist) {
      throw new NotFoundException('플레이리스트를 찾을 수 없습니다.');
    }
  
    // 비디오 총 시간 계산
    const totalTime = playlist.videos.reduce((sum, video) => sum + (video.duration || 0), 0);
  
    // 비디오 데이터 변환
    const videos = playlist.videos.map((video) => {
      const youtubeId = video.youtubeId?.trim() || null;
      return {
        id: video.id,
        title: video.title,
        url: youtubeId ? `https://youtube.com/watch?v=${youtubeId}` : null,
        thumbnailUrl: video.thumbnailUrl,
        artist: video.channelName || null, // channelName을 artist로 사용
        time: this.formatDuration(video.duration || 0), // duration을 포맷
      };
    });
  
    return {
      id: playlist.id,
      title: playlist.title,
      description: playlist.description || null,
      coverImage: playlist.coverImage || null,
      tags: playlist.tags.map((tag) => tag.tag.name),
      createdBy: playlist.user?.nickname || 'Unknown', // 닉네임 사용
      createdByMe: playlist.user?.id === userId, // 내가 만든 플레이리스트인지 여부
      liked: playlist.likes.some((like) => like.userId === userId), // 좋아요 여부
      totalTime: this.formatDuration(totalTime), // 포맷된 총 시간 반환
      videos,
    };
  }
  
  // 초 단위를 hh:mm:ss 또는 mm:ss 형식으로 변환하는 유틸리티 함수
  private formatDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
  
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  


  // 6. 플레이리스트 곡 제거
  async removeVideo(playlistId: number, videoId: number): Promise<any> {
    const video = await this.prisma.video.findUnique({ where: { id: videoId } });

    if (!video || video.playlistId !== playlistId) {
      throw new NotFoundException(`비디오 ID ${videoId}를 찾을 수 없습니다.`);
    }

    await this.prisma.video.delete({ where: { id: videoId } });

    return {
      playlistId,
      videoId,
      message: '곡 제거 성공',
    };
  }

  // 인기 플레이리스트 반환
  async getPopularPlaylists(limit: number) {
    return this.prisma.playlist.findMany({
      orderBy: { likesCount: 'desc' }, // 좋아요 수 내림차순
      take: limit, // 반환할 플레이리스트 개수
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        likesCount: true,
        createdAt: true,
      },
    });
  }

  // 최신 플레이리스트 반환
  async getLatestPlaylists(limit: number) {
    return this.prisma.playlist.findMany({
      orderBy: { createdAt: 'desc' }, // 생성일 내림차순
      take: limit, // 반환할 플레이리스트 개수
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        likesCount: true,
        createdAt: true,
      },
    });
  }

  // 내 플레이리스트 정렬 (기본: 최신순, 옵션: 가나다순)
  async getMyPlaylists(userId: number, sort: 'latest' | 'alphabetical' = 'latest') {
    // Prisma SortOrder 사용
    const orderBy: Prisma.PlaylistOrderByWithRelationInput =
      sort === 'alphabetical'
        ? { title: Prisma.SortOrder.asc } // 'asc'로 명시
        : { createdAt: Prisma.SortOrder.desc }; // 'desc'로 명시
  
    // 플레이리스트 조회 (videos 필드 포함)
    return this.prisma.playlist.findMany({
      where: { userId },
      orderBy,
      include: {
        videos: {
          select: {
            id: true,
            youtubeId: true,
            title: true,
            duration: true,
          },
        },
      },
    });
  }  
}