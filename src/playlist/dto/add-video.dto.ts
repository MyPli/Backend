import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddVideoDto {
  @ApiProperty({
    example: 'jWQx2f-CErU',
    description: '유튜브 동영상 ID',
  })
  @IsString()
  @IsNotEmpty({ message: '유효한 YouTube ID가 필요합니다.' })
  youtubeId: string;

  @ApiProperty({
    example: 'aespa 에스파 Whiplash MV',
    description: '동영상 제목',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'SMTOWN',
    description: '유튜브 채널 이름',
  })
  @IsString()
  @IsNotEmpty()
  channelName: string;

  @ApiProperty({
    example: 'https://img.youtube.com/vi/jWQx2f-CErU/0.jpg',
    description: '동영상 썸네일 URL',
  })
  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;

  @ApiProperty({
    example: null,
    description: '동영상 길이 (초 단위, 선택 사항입니다. 값을 제공하지 않아도 됩니다.)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    example: 1,
    description: '동영상 순서',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  order?: number;
}
