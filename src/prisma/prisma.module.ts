import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 전역 모듈로 선언 (다른 모듈에서 별도 import 없이 사용 가능)
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // PrismaService를 다른 모듈에서 사용할 수 있도록 내보냄
})
export class PrismaModule {}
