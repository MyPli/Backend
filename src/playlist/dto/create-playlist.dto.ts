import { IsString, IsOptional, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AddVideoDto } from './add-video.dto'


export class CreatePlaylistDto {
  @ApiProperty({
    example: 'My Favorite Songs',
    description: '플레이리스트 제목',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: '즐겨듣는 노래 모음',
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddVideoDto)
  @IsOptional()
  videos?: AddVideoDto[]; // 추가된 필드
}
