import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
