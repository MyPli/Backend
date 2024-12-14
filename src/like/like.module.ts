import { Module } from '@nestjs/common';
import { LikeController, UserLikesController } from './like.controller';
import { LikeService } from './like.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LikeController, UserLikesController],
  providers: [LikeService],
})
export class LikeModule {}
