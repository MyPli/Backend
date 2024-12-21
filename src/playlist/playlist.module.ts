import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { VideoModule } from '../video/video.module';
import { VideoService } from '../video/video.service';

@Module({
  imports: [PrismaModule, AuthModule, VideoModule],
  controllers: [PlaylistController],
  providers: [PlaylistService, VideoService],
})
export class PlaylistModule {}
