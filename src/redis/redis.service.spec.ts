import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('RedisService', () => {
  let redisService: RedisService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RedisModule.forRoot({
          type: 'single', // RedisModuleOptions 타입에 따라 수정
          options: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT, 10) || 6379,
            password: process.env.REDIS_PASSWORD || undefined, // 필요 시 비밀번호 추가
            db: parseInt(process.env.REDIS_DB, 10) || 0, // 데이터베이스 선택 (기본값: 0)
          },
        }),
      ],
      providers: [RedisService],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
  });

  afterAll(async () => {
    // 테스트 종료 후 Redis 연결 정리
    await redisService.del('testKey');
  });

  it('should set and get a value from Redis', async () => {
    await redisService.set('testKey', 'testValue', 60); // 60초 TTL 설정
    const value = await redisService.get('testKey');
    expect(value).toBe('testValue');
  });

  it('should check if a key exists in Redis', async () => {
    const exists = await redisService.exists('testKey');
    expect(exists).toBe(true);
  });

  it('should delete a key from Redis', async () => {
    await redisService.del('testKey');
    const exists = await redisService.exists('testKey');
    expect(exists).toBe(false);
  });

  it('should return null for a non-existent key', async () => {
    const value = await redisService.get('nonExistentKey');
    expect(value).toBeNull();
  });
});
