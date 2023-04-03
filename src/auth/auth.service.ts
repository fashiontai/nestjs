import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisCacheService: RedisCacheService,
    private userService: UserService,
  ) {
  }

  // 生成token
  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  async login(user: Partial<User>) {
    const nUser = await this.userService.getUserInfoByUsername(user);
    if (!nUser) {
      throw new HttpException('用户名不存在', HttpStatus.BAD_REQUEST);
    }

    console.log(28, user.password, nUser.password);

    if (!compareSync(user.password, nUser.password)) {
      throw new BadRequestException('用户名或密码错误');
    }

    const token = this.createToken({
      id: nUser.id,
      username: nUser.username,
      role: nUser.role,
    });

    await this.redisCacheService.cacheSet(
      `${nUser.id}&${nUser.username}&${nUser.role}`,
      token,
      1800,
    );

    return {
      token,
    };
  }

}
