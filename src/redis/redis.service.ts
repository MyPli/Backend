import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // Redis GET 메서드
  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.error(`Redis GET error for key "${key}": ${error.message}`);
      return null; // 반환값이 필요하므로 null을 반환
    }
  }

  // Redis SET 메서드 (TTL 설정 가능)
  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redis.set(key, value, 'EX', ttl);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      console.error(`Redis SET error for key "${key}": ${error.message}`);
      throw new Error(`Failed to set key "${key}" in Redis`); // 오류 전달
    }
  }

  // Redis 데이터 삭제
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error(`Redis DEL error for key "${key}": ${error.message}`);
      throw new Error(`Failed to delete key "${key}" in Redis`);
    }
  }

  // Redis 키 존재 여부 확인
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1; // Redis에서 1을 반환하면 존재
    } catch (error) {
      console.error(`Redis EXISTS error for key "${key}": ${error.message}`);
      return false; // 오류가 발생하면 키가 없다고 간주
    }
  }
}
