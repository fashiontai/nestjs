import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET'),
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(req, user: User) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const cacheToken = await this.redisCacheService.cacheGet(
      `${user.id}${user.username}${user.role}`,
    );
    if (!cacheToken) {
      throw new UnauthorizedException('token 已过期');
    }
    if (token !== cacheToken) {
      throw new UnauthorizedException('token 不正确');
    }
    const existUser = await this.userRepository.findOne({
      where: { username: user.username },
    });

    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }
    this.redisCacheService.cacheSet(
      `${user.id}${user.username}${user.role}`,
      token,
      1800,
    );
    return existUser;
  }
}
