import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { S3Module } from '../s3/s3.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule), // forwardRef로 AuthModule 참조
    PrismaModule,
    S3Module,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // UserService를 내보냄
})
export class UserModule {}
