import { Module, Global } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    NestRedisModule.forRoot({
      type: 'single',
      options: {
        host: process.env.REDIS_HOST, // AWS ElastiCache 엔드포인트
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD || undefined, // Auth Token 설정
        db: parseInt(process.env.REDIS_DB, 10) || 0,
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
