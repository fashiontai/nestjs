import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PostsEntity } from '../../posts/posts.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => PostsEntity, (post) => post.category)
  posts: PostsEntity[];

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_time',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    name: 'update_time',
  })
  updateTime: Date;
}

