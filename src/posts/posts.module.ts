import { Module, NestModule } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './posts.entity';
import { CategoryModule } from '../category/category.module';
import { TagModule } from '../tag/tag.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    TypeOrmModule.forFeature([PostsEntity]),
    CategoryModule,
    TagModule,
    AuthModule,
  ],
})
export class PostsModule {
}
