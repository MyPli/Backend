import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SearchVideoDto } from './dto/search-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('videos')
@UseGuards(JwtAuthGuard) // JwtAuthGuard로 인증 적용
@UsePipes(new ValidationPipe({ transform: true }))
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  // 동영상 추가
  @Post(':playlistId')
  async addVideo(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Body() dto: CreateVideoDto,
    @Request() req: any, // 요청에서 사용자 정보 추출
  ) {
    const userId = req.user.userId; // 인증된 사용자 ID
    return this.videoService.addVideo(playlistId, dto, userId);
  }

  // 플레이리스트 내 동영상 순서 업데이트
  @Patch(':playlistId/order')
  async updateOrder(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Body() dto: UpdateOrderDto[],
    @Request() req: any, // 요청에서 사용자 정보 추출
  ) {
    const userId = req.user.userId; // 인증된 사용자 ID
    return this.videoService.updateOrder(playlistId, dto, userId);
  }

  // 유튜브 동영상 검색 (인증 필요 없음)
  @Get('search')
  @ApiQuery({ name: 'keyword', required: true, description: '검색 키워드' })
  @ApiQuery({ name: 'maxResults', required: false, description: '검색 결과 수 (기본값: 5)', type: Number })
  async searchVideos(@Query() query: SearchVideoDto) {
    return this.videoService.searchVideos(query);
  }
}

