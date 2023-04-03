import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostsEntity } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto, PostInfoDto } from './dto/create-post.dto';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';

export interface PostsRo {
  list: PostsEntity[];
  count: number;
}

export interface QueryRo {
  limit: number;
  offset: number;

  [key: string]: any;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
  ) {
  }

  // 创建文章
  async create(user, post: CreatePostDto): Promise<number> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', HttpStatus.BAD_REQUEST);
    }
    const { tag, category = 0, status, isRecommend, coverUrl } = post;
    // 根据分类id获取分类
    const categoryDoc = await this.categoryService.findById(category);
    // 根据传入到标签id，如'1,2'获取标签
    const tags = await this.tagService.findByIds(
      ('' + tag).split(',').map((id) => +id),
    );
    const postParam: Partial<PostsEntity> = {
      ...post,
      isRecommend: Number(isRecommend),
      category: categoryDoc,
      tags,
      author: user,
    };
    // 判断状态，为publish则设置发布时间
    if (status === 'publish') {
      Object.assign(postParam, {
        publishTime: new Date(),
      });
    }
    const newPost: PostsEntity = await this.postsRepository.create({
      ...postParam,
    });
    const created = await this.postsRepository.save(newPost);
    return created.id;
  }

  // async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
  //   const { title } = post;
  //   if (!title) {
  //     throw new HttpException('缺少文章标题', 401);
  //   }
  //   const doc = await this.postsRepository.findOne({ where: { title } });
  //   if (doc) {
  //     throw new HttpException('文章已存在', 401);
  //   }
  //   return await this.postsRepository.save(post);
  // }

  // 获取文章列表
  // async findAll(query): Promise<PostsRo> {
  //   const [posts, count] = await this.postsRepository.findAndCount();
  //   return {
  //     list: posts,
  //     count,
  //   };
  // }
  async findAll(query: Partial<QueryRo> = {}): Promise<PostsRo> {
    const { limit = 10, offset = 0 } = query;
    const [list, count] = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .limit(limit)
      .offset(offset)
      .orderBy('post.update_time', 'DESC')
      .getManyAndCount();
    return {
      list,
      count,
    };
  }

  // 获取指定文章
  // async findById(id): Promise<PostsEntity> {
  //   return await this.postsRepository.findOneBy({ id });
  // }

  async findById(id): Promise<PostInfoDto> {
    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.author', 'user')
      .where('post.id=:id')
      .setParameter('id', id);
    const result = await qb.getOne();
    if (!result) {
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    }
    await this.updateById(id, { count: result.count + 1 });
    return Object.assign(result.toResponseObject(), {
      count: result.count + 1,
    });
  }


  // 更新文章
  async updateById(id, post): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOneBy({ id });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  // 删除文章
  async remove(id) {
    const existPost = await this.postsRepository.findOneBy({ id });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    }
    return await this.postsRepository.remove(existPost);
  }
}
