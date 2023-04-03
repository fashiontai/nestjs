import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  // 注册全局错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 注册全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 注册全局管道
  app.useGlobalPipes(new ValidationPipe());

  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('管理后台')
    .setDescription('管理后台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    // .addTag('tag', 'tag1') // 添加标签
    // .addServer('/aa')
    // .setTermsOfService('aaa') // 添加链接
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}

bootstrap();
