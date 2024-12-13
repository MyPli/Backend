import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module'; // Prisma 연결

@Module({
  imports: [
    AuthModule, // Auth 모듈 등록
    UserModule, // User 모듈 등록
    PrismaModule, // Prisma 모듈 등록
  ],
})
export class AppModule {}
