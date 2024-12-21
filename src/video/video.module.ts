import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService], // VideoService를 외부로 노출
})
export class VideoModule {}
