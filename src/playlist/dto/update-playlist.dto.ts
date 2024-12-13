import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdatePlaylistDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]; // 태그는 문자열 배열로 입력받음
}
