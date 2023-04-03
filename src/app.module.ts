import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import envConfig from '../config/env';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsEntity } from './posts/posts.entity';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置成全局
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [PostsEntity], // 数据表实体
        autoLoadEntities: true,
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认localhost
        port: configService.get('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'), // 用户名
        password: configService.get('DB_PASSWORD', 'root'), // 密码
        database: configService.get('DB_DATABASE', 'blog'), // 数据库名
        timezone: '+08:00', // 服务器上配置的时区
        synchronize: true, // 根据实体自动创建数据库表，生产环境建议关闭
      }),
    }),
    PostsModule,
    UserModule,
    AuthModule,
    CategoryModule,
    TagModule,
    RedisCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
