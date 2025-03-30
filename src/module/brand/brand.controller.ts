import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { QueryParam } from 'src/common/queryParam';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import RoleGuard from '../auth/guard/role.guard';
import { ERole } from 'src/database/entity/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBrandDto } from './dto/createBrand.dto';
import { DataSource } from 'typeorm';
import { Brand } from 'src/database/entity/brand.entity';
import { ImageService } from '../image/image.service';
import { Image } from 'src/database/entity/image.entity';
import { UpdateBrandDto } from './dto/updateBrand.dto';
import { IdParam } from 'src/common/validate';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { genKeyQuery } from 'src/util/utils';

@Controller('brand')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly dataSource: DataSource,
    private readonly imageService: ImageService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('REDIS_MANAGER') private readonly redisManager: Redis,
  ) {}

  @Get()
  async find(@Query() query: QueryParam) {
    const { page, limit } = query
    let key = `brand-search:${genKeyQuery(query as any)}`
    if (!page && !limit) {
      key = `brand-search:group`
    }
    return this.cacheManager.wrap(
      key,
      () => this.brandService.find(query),30*60*1000
    );
  }

  @Get('all')
  async findAll() {
    return this.cacheManager.wrap(`brand-search:all`, () =>
      this.brandService.findAll(),30*60*1000
    );
  }

  @Post()
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
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
    @Body() createBrandDto: CreateBrandDto,
  ) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const brand = await queryRunner.manager.findOneBy(Brand, {
        name: createBrandDto.name,
      });
      if (brand) {
        await this.imageService.delete(brand.imageId, queryRunner);
        const new_image: Image = await this.imageService.create(
          file,
          undefined,
          queryRunner,
        );
        await this.brandService.update(
          brand.id,
          { imageId: new_image.id, name: createBrandDto.name },
          queryRunner,
        );
      } else {
        const new_image: Image = await this.imageService.create(
          file,
          undefined,
          queryRunner,
        );
        await this.brandService.create(
          { ...createBrandDto, imageId: new_image.id },
          queryRunner,
        );
      }
      await queryRunner.commitTransaction();

      const keys = await this.redisManager.keys('brand-search:*');
      await this.cacheManager.mdel(keys);
      return { message: 'Create brand successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction;
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Put(':id')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Body() updateBrandDto: UpdateBrandDto,
    @Param() { id }: IdParam,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp|gif)$/,
        })

        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 🎯 Giới hạn file tối đa 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const brand: Brand = await queryRunner.manager.findOneBy(Brand, { id });
      if (!brand) {
        throw new NotFoundException('Not found brand');
      }

      if (file) {
        await this.imageService.delete(brand.imageId, queryRunner);
        const new_image = await this.imageService.create(
          file,
          undefined,
          queryRunner,
        );
        await this.brandService.update(
          id,
          { ...updateBrandDto, imageId: new_image.id },
          queryRunner,
        );
      } else {
        await this.brandService.update(id, updateBrandDto, queryRunner);
      }
      await queryRunner.commitTransaction();
      const keys = await this.redisManager.keys('brand-search:*');
      await this.cacheManager.mdel(keys);

      return { message: 'Update brand successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Delete(':id')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async delete(@Param() { id }: IdParam) {
    const brand = await this.brandService.findById(id);

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.brandService.deleteById(brand.id, queryRunner);
      await this.imageService.delete(brand.imageId, queryRunner);

      await queryRunner.commitTransaction();
      const keys = await this.redisManager.keys('brand-search:*');
      await this.cacheManager.mdel(keys);
      return { message: 'Delete brand successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
