  import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findByProductId(productId: string) {
    return this.imageRepo.findBy({productId}) 
  }

  async delete(imageId:string, queryRunner?: QueryRunner){
    if(!imageId){
      return
    }
    if(queryRunner){

      const image: Image = await queryRunner.manager.findOneBy(Image,{id: imageId})
      if(!image){
        throw new NotFoundException('Not found image')
      }
      
      await  queryRunner.manager.delete(Image, imageId)
      await this.firebaseStorageService.deleteFile(image.key)
      return {message: 'delete image successfully'}
    }

    const image: Image = await this.imageRepo.findOneBy({id: imageId})
    await this.imageRepo.delete(imageId)
    await this.firebaseStorageService.deleteFile(image.key)

    return {message: 'delete image successfully'}
   
  }
}
