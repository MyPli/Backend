import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 Validation Pipe 설정 (DTO 유효성 검사 활성화)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 값은 자동으로 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 들어오면 에러 발생
      transform: true, // 요청 데이터를 DTO로 자동 변환
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('MyPli API')
    .setDescription('플레이리스트 공유 서비스를 위한 REST API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증 추가
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 서버 실행
  const port = process.env.PORT;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
