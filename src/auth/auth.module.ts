import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { UserModule } from '../user/user.module';

// 这是同步生成jwt
// const jwtModule = JwtModule.register({
//   secret: '1q2w3e4r5t',
//   signOptions: { expiresIn: '4h' },
// });

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('SECRET', 'test123456'),
      // signOptions: { expiresIn: '4h' },
    };
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    jwtModule,
    RedisCacheModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [jwtModule],
})
export class AuthModule {
}
