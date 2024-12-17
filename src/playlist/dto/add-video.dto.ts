import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddVideoDto {
  @IsString()
  @IsNotEmpty()
  youtubeId: string; // 유튜브 동영상 ID

  @IsString()
  @IsNotEmpty()
  title: string; // 동영상 제목

  @IsString()
  @IsNotEmpty()
  channelName: string; // 채널 이름

  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string; // 썸네일 URL

  @IsNumber()
  @IsOptional() // duration을 선택적으로 변경
  duration?: number; // 동영상 길이 (초 단위)

  @IsNumber()
  @IsOptional()
  order?: number; // 동영상 순서 (옵션)
}
