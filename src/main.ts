import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

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
