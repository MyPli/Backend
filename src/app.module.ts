import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LikeModule } from './like/like.module';
import { PlaylistModule } from './playlist/playlist.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [LikeModule, PlaylistModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
