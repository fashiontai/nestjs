import { Controller, Get, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import * as fs from 'fs';
import * as crypto from 'crypto';

export const ApiFile =
  (filename: string = 'file'): MethodDecorator =>
    (target, propertyKey, descriptor) => {
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            [filename]: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      });
    };
const image = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'webp'];
const video = ['mp4', 'webm'];
const audio = ['mp3', 'wav', 'ogg'];

// 主路径为app
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  // 1.固定路径：
  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  // 可以匹配到 get请求，http://localhost:3000/app/list
  @Get('list')
  getHello(): string {
    return this.appService.getHello();
  }

  // 可以匹配到 post请求，http://localhost:3000/app/list
  @Post('list')
  create(): string {
    return 'create';
  }

  // 2.通配符路径(?+*三种通配符)
  // 可以匹配到 get请求，http://localhost:3000/app/user_xxx
  @Get('user_*')
  getUser(): string {
    return 'user_通配符';
  }

  // 3.带参数路径
  // 可以匹配到put请求，http://localhost:3000/app/list/xxx
  @Put('list/user')
  updateUser(): { userId: number } {
    return { userId: 1 };
  }

  @Put('list/:id')
  update(): string {
    return 'update';
  }

  // @Post('upload')
  // @ApiOperation({ summary: '上传文件' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: multer.diskStorage({
  //       // 配置上传后文件的存储位置
  //       destination: (req, file, cb) => {
  //         // 根据上传的文件类型将图片视频音频和其他类型文件分别存到对应到英文文件夹下
  //         const mimeType = file.mimetype.split('/')[1];
  //         let temp = 'other';
  //         image.filter((item) => item === mimeType).length > 0
  //           ? (temp = 'image')
  //           : '';
  //         video.filter((item) => item === mimeType).length > 0
  //           ? (temp = 'video')
  //           : '';
  //         audio.filter((item) => item === mimeType).length > 0
  //           ? (temp = 'audit')
  //           : '';
  //         const filePath = `/home/aaa`;
  //         if (!fs.existsSync(filePath)) {
  //           fs.mkdirSync(filePath);
  //         }
  //         return cb(null, `${filePath}`);
  //       },
  //       // 配置文件名称
  //       filename: async (req: any, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) => {
  //         const index = file.originalname.lastIndexOf('.');
  //         const md5File = await getMd5File(file);
  //         // 获取后缀
  //         const ext = file.originalname.substring(index);
  //         callback(null, md5File + ext);
  //       },
  //     }),
  //   }),
  // )
  // async uploadFile(
  //   @UploadedFile('file') file: Express.Multer.File,
  // ): Promise<any> {
  //   console.log('0000', file);
  // }

}

function getMd5File(file) {
  const buffer = Buffer.from(JSON.stringify(file), 'utf-8');
  return crypto.createHash('md5').update(JSON.stringify(buffer)).digest('hex');
}
