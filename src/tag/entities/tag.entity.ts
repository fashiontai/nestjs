import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PostsEntity } from '../../posts/posts.entity';

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  // 标签名
  @Column()
  name: string;

  @ManyToMany(() => PostsEntity, (post) => post.tags)
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
