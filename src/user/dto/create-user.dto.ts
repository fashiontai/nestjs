import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名必填' })
  readonly username: string; // 用户名

  @ApiProperty({ description: '昵称' })
  readonly nickname: string; // 昵称

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码必填' })
  readonly password: string; // 密码

  @ApiProperty({ description: '邮箱' })
  email: string; // 邮箱
}
