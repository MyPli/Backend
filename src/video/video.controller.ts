import {
  Controller,
  Patch,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiBearerAuth, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth() // JWT 인증 추가
@Controller('/videos')
@UseGuards(JwtAuthGuard) // JwtAuthGuard로 인증 적용
@UsePipes(new ValidationPipe({ transform: true }))
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  // 플레이리스트 내 동영상 순서 업데이트
  @Patch(':playlistId/order')
  @ApiOperation({
    summary: '플레이리스트 내 동영상 순서 업데이트',
    description: '플레이리스트에 속한 동영상들의 순서를 업데이트합니다.',
  })
  @ApiParam({
    name: 'playlistId',
    description: '플레이리스트 ID',
    type: Number,
  })
  @ApiBody({
    type: [UpdateOrderDto], // 배열로 인식시키기
    description: '동영상 ID와 순서 정보를 포함하는 배열',
    examples: {
      example1: {
        summary: '예시 데이터',
        value: [
          { id: 1, order: 1 },
          { id: 2, order: 2 },
        ],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '동영상 순서 업데이트 성공',
    schema: {
      example: [
        { id: 1, order: 1 },
        { id: 2, order: 2 },
      ],
    },
  })
  async updateOrder(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Body() dto: UpdateOrderDto[],
    @Request() req: any,
  ) {
    const userId = req.user.userId;
    return this.videoService.updateOrder(playlistId, dto, userId);
  }
}