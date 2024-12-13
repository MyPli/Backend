import { Module } from '@nestjs/common';
import { LikeController, UserLikesController } from './like.controller';
import { LikeService } from './like.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LikeController, UserLikesController],
  providers: [LikeService],
})
export class LikeModule {}
