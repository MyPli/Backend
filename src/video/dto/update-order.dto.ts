import { IsNumber } from 'class-validator';

export class UpdateOrderDto {
  @IsNumber()
  id: number;

  @IsNumber()
  order: number;
}
