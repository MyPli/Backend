import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LikeModule } from './like/like.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PlaylistModule } from './playlist/playlist.module';
import { VideoModule } from './video/video.module';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [LikeModule, PlaylistModule, VideoModule, PrismaModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
