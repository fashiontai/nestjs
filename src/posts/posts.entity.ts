import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Category } from '../category/entities/category.entity';
import { JoinColumn, JoinTable } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { PostInfoDto } from './dto/create-post.dto';

@Entity('posts')
export class PostsEntity {
  // 标注为主列，值自动生成
  @PrimaryGeneratedColumn()
  id: number;
  // 文章标题
  @Column({ length: 50 })
  title: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  content: string;
  // markdown 转html，自动生成
  @Column({ type: 'mediumtext', default: null, name: 'content_html' })
  contentHtml: string;
  // 摘要 自动生成
  @Column({ type: 'text', default: null })
  summary: string;
  // 封面图
  @Column({ default: null, name: 'cover_url' })
  coverUrl: string;
  // 阅读量
  @Column({ type: 'int', default: 0 })
  count: number;
  // 点击量
  @Column({ type: 'int', default: 0, name: 'like_count' })
  likeCount: number;
  // 推荐显示
  @Column({ type: 'tinyint', default: 0, name: 'is_recommend' })
  isRecommend: number;
  // 文章状态
  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string;
  // 作者
  @ManyToOne(() => User, (user) => user.nickname)
  author: User;
  // 分类
  @Exclude()
  @ManyToOne(() => Category, (category) => category.posts)
  @JoinColumn({
    name: 'category_id',
  })
  category: Category;

  //标签
  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tag',
    joinColumns: [{ name: 'post_id' }],
    inverseJoinColumns: [{ name: 'tag_id' }],
  })
  tags: Tag[];

  @Column({ type: 'tinyint', default: 0 })
  type: number;

  @Column({ type: 'timestamp', name: 'publish_name', default: null })
  publishTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  toResponseObject(): PostInfoDto {
    const responseObj: PostInfoDto = {
      ...this,
      isRecommend: Boolean(this.isRecommend),
    };
    if (this.category) {
      responseObj.category = this.category.name;
    }
    if (this.tags && this.tags.length) {
      responseObj.tags = this.tags.map((item) => item.name);
    }
    if (this.author && this.author.id) {
      responseObj.userId = this.author.id;
      responseObj.author = this.author.nickname || this.author.username;
    }
    return responseObj;
  }
}

