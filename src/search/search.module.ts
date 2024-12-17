import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { VideoService } from '../video/video.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SearchController],
  providers: [VideoService, PrismaService],
})
export class SearchModule {}
