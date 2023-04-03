import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Exclude } from 'class-transformer';
import { PostsEntity } from '../../posts/posts.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  username: string; // 用户名

  @Column({ length: 100, nullable: true })
  nickname: string; // 昵称

  @Exclude()
  @Column({ select: false, nullable: true })
  password: string; // 密码

  @Column({ default: null })
  avatar: string; // 头像

  @Column()
  email: string; // 邮箱

  @Column({ default: null })
  openid: string;

  @Column('simple-enum', { enum: ['root', 'author', 'visitor'], default: 'visitor' })
  role: string; // 用户角色


  @OneToMany(() => PostsEntity, (post) => post.author)
  posts: PostsEntity[];

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = bcrypt.hashSync(this.password, 10);
  }


}
