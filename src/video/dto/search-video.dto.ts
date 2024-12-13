import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchVideoDto {
  @IsString()
  keyword: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) // 문자열을 숫자로 변환
  maxResults?: number = 5; // 기본값 설정
}
