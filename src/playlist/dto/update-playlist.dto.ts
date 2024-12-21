import { IsString, IsOptional, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VideoDto {
  @ApiProperty({
    example: 'abc123',
    description: '유튜브 동영상 ID',
  })
  @IsString()
  youtubeId: string;

  @ApiProperty({
    example: 'New Song Title',
    description: '동영상 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'https://img.youtube.com/vi/jWQx2f-CErU/0.jpg',
    description: '동영상 썸네일 URL',
  })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({
    example: 'Channel Name',
    description: '채널 이름',
  })
  @IsString()
  channelName: string;

  @ApiProperty({
    example: 180,
    description: '동영상 길이(초 단위)',
  })
  @IsOptional()
  duration?: number;

  @ApiProperty({
    example: 1,
    description: '동영상 순서',
  })
  @IsOptional()
  order?: number;
}

export class VideosDto {
  @ApiProperty({
    description: '삭제할 동영상 ID 목록',
    example: [101, 102],
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  toRemove?: number[];

  @ApiProperty({
    description: '추가할 동영상 정보 목록',
    example: [
      {
        youtubeId: 'abc123',
        title: 'New Song Title',
        thumbnailUrl: 'https://img.youtube.com/vi/jWQx2f-CErU/0.jpg',
        channelName: 'Channel Name',
        duration: 180,
        order: 2,
      },
    ],
    type: [VideoDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoDto)
  @IsOptional()
  toAdd?: VideoDto[];
}

export class UpdatePlaylistDto {
  @ApiProperty({
    example: 'Updated Playlist Title',
    description: '플레이리스트 제목',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Updated description',
    description: '플레이리스트 설명',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: ['Pop', 'K-Pop'],
    description: '플레이리스트 태그 목록',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: '플레이리스트 수정 시 동영상 추가/삭제 정보',
    type: VideosDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => VideosDto)
  @IsOptional()
  videos?: VideosDto;
}
