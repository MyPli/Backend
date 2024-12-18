import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddVideoDto } from './add-video.dto';
import { Type } from 'class-transformer';

export class CreatePlaylistDto {
  @ApiProperty({
    example: 'My Favorite Songs',
    description: '플레이리스트 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '즐겨듣는 노래들을 모았습니다.',
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
    description: '플레이리스트에 추가할 첫 번째 곡 정보',
    type: AddVideoDto,
  })
  @ValidateNested()
  @Type(() => AddVideoDto)
  firstVideo: AddVideoDto;
}
