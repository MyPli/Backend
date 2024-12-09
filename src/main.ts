import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
