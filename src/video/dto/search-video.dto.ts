import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchVideoDto {
  @IsString()
  keyword: string; // 필수 검색 키워드

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'maxResults는 정수여야 합니다.' })
  maxResults: number = 5; // 기본값 설정
}
