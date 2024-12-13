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
  } from '@nestjs/common';
  import { VideoService } from './video.service';
  import { CreateVideoDto } from './dto/create-video.dto';
  import { UpdateOrderDto } from './dto/update-order.dto';
  import { SearchVideoDto } from './dto/search-video.dto';
  import { ApiQuery } from '@nestjs/swagger';
  
  @Controller('videos')
  @UsePipes(new ValidationPipe({ transform: true }))
  export class VideoController {
    constructor(private readonly videoService: VideoService) {}
  
    @Post(':playlistId')
    async addVideo(
      @Param('playlistId', ParseIntPipe) playlistId: number,
      @Body() dto: CreateVideoDto,
    ) {
      return this.videoService.addVideo(playlistId, dto);
    }
  
    @Patch(':playlistId/order')
    async updateOrder(
      @Param('playlistId', ParseIntPipe) playlistId: number,
      @Body() dto: UpdateOrderDto[],
    ) {
      return this.videoService.updateOrder(playlistId, dto);
    }
  
    @Get('search')
    @ApiQuery({ name: 'keyword', required: true, description: '검색 키워드' })
    @ApiQuery({ name: 'maxResults', required: false, description: '검색 결과 수 (기본값: 5)', type: Number })
    async searchVideos(@Query() query: SearchVideoDto) {
      return this.videoService.searchVideos(query);
    }
  }
  