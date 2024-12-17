import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 1, description: '사용자의 고유 ID' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: '사용자의 이메일 주소' })
  email: string;

  @ApiProperty({ example: 'nickname123', description: '사용자의 닉네임' })
  nickname: string;

  @ApiProperty({
    example: 'https://example.com/profile-image.png',
    description: '사용자의 프로필 이미지 URL',
  })
  profileImage?: string;

  @ApiProperty({
    example: 'email',
    description: '사용자 인증 제공자 (예: email, google)',
  })
  authProvider: string;

  @ApiProperty({ example: '2024-06-01T12:00:00Z', description: '계정 생성 일자' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-10T12:00:00Z', description: '계정 마지막 업데이트 일자' })
  updatedAt: Date;
}
