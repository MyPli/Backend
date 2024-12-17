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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('비디오') // Swagger 그룹화
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
    @Request() req: any, // 요청에서 사용자 정보 추출
  ) {
    const userId = req.user.userId; // 인증된 사용자 ID
    return this.videoService.updateOrder(playlistId, dto, userId);
  }
}
