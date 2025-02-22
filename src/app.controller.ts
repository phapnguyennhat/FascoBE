import { Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { AnyFilesInterceptor, FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Post()
  @UseInterceptors(AnyFilesInterceptor()) // ✅ Cho phép upload nhiều trường
  async test(@UploadedFiles() files: Express.Multer.File[]) {
  }
  
  
}
