  import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { FirebaseStorageService } from '../firebase-storage/firebase-storage.service';
import { Image } from 'src/database/entity/image.entity';

@Injectable()
export class ImageService {
  folder : string
  constructor(
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>,
    private readonly firebaseStorageService: FirebaseStorageService
  ) {
    this.folder = 'startup'
  }

  async create(imageFile: Express.Multer.File, productId?:string, queryRunner ?: QueryRunner){
    if(!imageFile){
      throw new BadRequestException('Vui long tải file lên')
    }
    const result = await this.firebaseStorageService.uploadFile(imageFile)
    if(queryRunner){

      return queryRunner.manager.save(Image, {...result, productId})
    }
    return this.imageRepo.save({...result, productId})
  }

  async delete(imageId:string, queryRunner?: QueryRunner){
    if(queryRunner){

      const image: Image = await queryRunner.manager.findOneBy(Image,{id: imageId})
      await this.firebaseStorageService.deleteFile(image.key)
      return  queryRunner.manager.delete(Image, imageId)
    }

    const image: Image = await this.imageRepo.findOneBy({id: imageId})
    await this.firebaseStorageService.deleteFile(image.key)

   
    return this.imageRepo.delete(imageId)
  }
}
