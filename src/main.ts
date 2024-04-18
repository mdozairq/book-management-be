import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configs } from './config/config';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './errors/custom.errors';
import helmet from 'helmet';
import * as compression from 'compression';
import { GlobalResponseInterceptor } from './common/response.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(Configs().context)
  app.enableVersioning({
    type: VersioningType.URI,
  })
  const config = new DocumentBuilder()
    .setTitle('MERN Challenge APIs')
    .setDescription('MERN Challenge API Details')
    .setVersion('v1')
    .addTag('mern-challenge-api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('mern-challenge/api', app, document);
  app.use(helmet());
  app.enableCors();
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(compression());
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  await app.listen(Configs().port, '0.0.0.0');
}
bootstrap();
