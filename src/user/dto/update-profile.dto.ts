import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
   @ApiPropertyOptional({
    example: 'new_nickname',
    description: '사용자의 새로운 닉네임',
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({
    example: 'new_profile_image.png',
    description: '사용자의 새로운 프로필 이미지 파일',
  })
  @IsOptional()
  @IsString()
  profileImage?: string; 
}
