import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteDetail } from 'src/database/entity/favoriteDetail.entity';
import { In, Repository } from 'typeorm';
import { CreateFavorite, CreateFavoriteDto } from './dto/createFavorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(FavoriteDetail) private readonly favoriteDetailRepo: Repository<FavoriteDetail>
  ){}

  async create(createFavorite: CreateFavorite){
   return  this.favoriteDetailRepo.save(createFavorite)
    
  }

  async findByUser(userId: string){
    
  }
  
  async deleteAbulk(userId: string, productIds: string[]){
   return this.favoriteDetailRepo.delete({userId, productId: In(productIds)})
  }


}
