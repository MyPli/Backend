import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LikeModule } from './like/like.module';
import { PlaylistModule } from './playlist/playlist.module';
import { VideoModule } from './video/video.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [LikeModule, PlaylistModule, VideoModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
