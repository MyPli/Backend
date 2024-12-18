import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({
    example: 101,
    description: '업데이트할 동영상 ID',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 1,
    description: '업데이트할 동영상 순서',
  })
  @IsNumber()
  order: number;
}
