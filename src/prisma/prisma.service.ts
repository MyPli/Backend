import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 부모 클래스(PrismaClient)의 생성자 호출
    super({
      log: ['query', 'info', 'warn', 'error'], // 로그 옵션 (개발 환경에서 유용)
    });
  }

  // 모듈 초기화 시 Prisma 연결
  async onModuleInit() {
    await this.$connect();
    console.log('Prisma connected to the database');
  }

  // 모듈 종료 시 Prisma 연결 해제
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma disconnected from the database');
  }

  // 트랜잭션 실행 메서드 (예: 다중 작업 처리)
  async executeTransaction(operations: any[]) {
    return this.$transaction(operations);
  }
}
