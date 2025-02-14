import { IdParam } from './../../common/validate';
import { BadRequestException, Body, Controller, Get, HttpStatus, ParseFilePipeBuilder, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataSource } from 'typeorm';
import { ImageService } from '../image/image.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly imageService: ImageService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: Request) {
    return req.user;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.email !== req.user.email) {
      const user = await this.userService.getByEmail(updateUserDto.email);
      if (user) {
        throw new BadRequestException('Email has already used');
      }
    }
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Put('/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp|gif)$/,
        })
        
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (req.user.avatarId) {
        await this.imageService.delete(req.user.avatarId, queryRunner);
      }

      const new_image = await this.imageService.create(
        file,
        undefined,
        queryRunner,
      );
      await this.userService.update(
        req.user.id,
        { avatarId: new_image.id },
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return { message: 'Update avatar successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
