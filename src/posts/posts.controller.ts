import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query, Req, UseGuards,
} from '@nestjs/common';
import { PostsService, PostsRo } from './posts.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { RoleGuard, Roles } from 'src/auth/role.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('文章')
@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  /**
   * 创建文章
   * @patams post
   */
  @ApiOperation({ summary: '创建文章' })
  @ApiBearerAuth()
  @Post()
  @Roles('admin', 'root')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  async create(@Body() post: CreatePostDto, @Req() req) {
    return await this.postsService.create(req.user, post);
  }

  /**
   * 获取所有文章
   */
  @ApiOperation({ summary: '获取文章列表' })
  @Get()
  async findAll(@Query() query): Promise<PostsRo> {
    return await this.postsService.findAll(query);
  }

  /**
   * 获取指定文章
   * @param id
   */
  @ApiOperation({ summary: '根据id获取文章详情' })
  @Get(':id')
  async findById(@Param('id') id) {
    return await this.postsService.findById(id);
  }

  /**
   * 更新文章
   * @param id
   * @param post
   */
  @ApiOperation({ summary: '根据id更新文章' })
  @Put(':id')
  async update(@Param('id') id, @Body() post) {
    return await this.postsService.updateById(id, post);
  }

  /**
   * 删除文章
   * @param id
   */
  @ApiOperation({ summary: '根据id删除文章' })
  @Delete(':id')
  async remove(@Param('id') id) {
    return await this.postsService.remove(id);
  }
}
