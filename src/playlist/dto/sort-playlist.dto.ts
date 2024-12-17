import { IsOptional, IsIn } from 'class-validator';

export class PlaylistSortDto {
  @IsOptional()
  @IsIn(['latest', 'alphabetical'], { message: "sort 값은 'latest' 또는 'alphabetical'이어야 합니다." })
  sort: 'latest' | 'alphabetical';
}
