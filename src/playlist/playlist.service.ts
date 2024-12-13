import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddVideoDto } from './dto/add-video.dto';

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. 플레이리스트 생성
  async createPlaylist(dto: CreatePlaylistDto, userId: number): Promise<any> {
    const { title, description, tags } = dto;

    // 플레이리스트 생성
    const playlist = await this.prisma.playlist.create({
      data: {
        title,
        description,
        user: { connect: { id: userId } },
      },
    });

    // 태그 처리 (connectOrCreate 사용)
    if (tags && tags.length > 0) {
      await Promise.all(
        tags.map(async (tag) => {
          await this.prisma.playlistTag.create({
            data: {
              playlist: { connect: { id: playlist.id } },
              tag: {
                connectOrCreate: {
                  where: { name: tag }, // 태그가 존재하는지 확인
                  create: { name: tag }, // 존재하지 않으면 새 태그 생성
                },
              },
            },
          });
        }),
      );
    }

    return playlist;
  }

  // 2. 플레이리스트 수정
  async updatePlaylist(
    id: number,
    userId: number,
    dto: UpdatePlaylistDto,
  ): Promise<any> {
    const { title, description, tags } = dto;

    // 기존 플레이리스트 가져오기
    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: { tags: true }, // 기존 태그 포함
    });

    if (!playlist || playlist.userId !== userId) {
      throw new UnauthorizedException(
        '이 플레이리스트를 수정할 권한이 없습니다.',
      );
    }

    // 플레이리스트 업데이트
    const updatedPlaylist = await this.prisma.playlist.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    // 태그 업데이트 처리
    if (tags && tags.length > 0) {
      // 기존 태그 삭제
      await this.prisma.playlistTag.deleteMany({
        where: { playlistId: id },
      });

      // 새로운 태그 추가 (connectOrCreate 방식 사용)
      const tagData = tags.map((tag) => ({
        where: { name: tag },
        create: { name: tag },
      }));

      await Promise.all(
        tagData.map(async (tag) => {
          await this.prisma.playlistTag.create({
            data: {
              playlist: { connect: { id } },
              tag,
            },
          });
        }),
      );
    }

    return updatedPlaylist;
  }

  // 3. 플레이리스트 삭제
  async deletePlaylist(id: number): Promise<string> {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      throw new NotFoundException(`플레이리스트 ID ${id}를 찾을 수 없습니다.`);
    }

    await this.prisma.playlist.delete({ where: { id } });
    return `플레이리스트 ID ${id}가 삭제되었습니다.`;
  }

  // 4. 동영상 추가
  async addVideo(playlistId: number, dto: AddVideoDto): Promise<any> {
    const { youtubeId, title, channelName, thumbnailUrl, duration, order } =
      dto;

    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });
    if (!playlist) {
      throw new NotFoundException(
        `플레이리스트 ID ${playlistId}를 찾을 수 없습니다.`,
      );
    }

    const video = await this.prisma.video.create({
      data: {
        playlistId,
        youtubeId,
        title,
        channelName,
        thumbnailUrl,
        duration,
        order: order ?? 0,
      },
    });

    return video;
  }
}
