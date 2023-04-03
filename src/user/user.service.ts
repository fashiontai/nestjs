import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  // InjectRepository 注入存储库
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
  }

  async register(createUser: CreateUserDto) {
    const { username } = createUser;
    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException('用户名存在', HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }

  async getUserInfoByUsername(user: Partial<User>): Promise<User> {


    const userInfo = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username: user.username })
      .getOne();
    //
    // const userInfo = await this.userRepository.findOne({
    //   where: { username: user.username },
    // });

    console.log(34, userInfo);
    return userInfo;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
