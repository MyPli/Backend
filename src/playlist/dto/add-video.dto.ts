import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AddVideoDto {
  @IsString()
  youtubeId: string; // 유튜브 동영상 ID

  @IsString()
  title: string; // 동영상 제목

  @IsString()
  channelName: string; // 채널 이름

  @IsString()
  thumbnailUrl: string; // 썸네일 URL

  @IsNumber()
  duration: number; // 동영상 길이 (초 단위)

  @IsOptional()
  @IsNumber()
  order?: number; // 동영상 순서 (옵션)
}
