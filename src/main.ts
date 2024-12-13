import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe 전역 설정 추가
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO에 정의된 속성만 허용
    forbidNonWhitelisted: true, // 정의되지 않은 속성이 요청에 있으면 예외 발생
    transform: true, // 요청 데이터를 DTO에 정의된 타입으로 변환
  }));

  // Swagger 설정 추가
  const config = new DocumentBuilder()
    .setTitle('MyPli API')
    .setDescription('플레이리스트 공유 서비스를 위한 REST API 문서입니다.')
    .setVersion('1.0')
    .addTag('Playlist Service')
    .build();

  // Swagger 문서 생성 및 설정
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // '/api' 경로에서 Swagger UI 확인 가능

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
