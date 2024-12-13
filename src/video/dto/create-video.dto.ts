import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  youtubeId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  channelName: string;

  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsOptional()
  order?: number;
}
