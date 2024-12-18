import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchVideoDto {
  @ApiProperty({
    example: '뉴진스',
    description: '검색할 키워드입니다.',
  })
  @IsString()
  keyword: string;

  @ApiProperty({
    example: 5,
    description: '검색 결과 최대 개수 (기본값: 5, 선택 사항)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'maxResults는 정수여야 합니다.' })
  maxResults: number = 5; // 기본값 설정
}
