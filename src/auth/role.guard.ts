import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 获取路由到角色
    const roles = this.reflector.get('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    // 读取user
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      return false;
    }
    // 判断用户到角色是否包含和roles相同到角色列表，并返回一个布尔类型
    return roles.some((role) => role === user.role);
  }
}
