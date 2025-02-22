import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteDetail } from 'src/database/entity/favoriteDetail.entity';
import { In, Repository } from 'typeorm';
import { CreateFavorite, CreateFavoriteDto } from './dto/createFavorite.dto';
import { QueryFavoriteDto } from './dto/queryFavorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(FavoriteDetail) private readonly favoriteDetailRepo: Repository<FavoriteDetail>
  ){}

  async create(createFavorite: CreateFavorite){
   return  this.favoriteDetailRepo.save(createFavorite)
    
  }

  async findByUser(userId: string, queryFavoriteDto: QueryFavoriteDto){
    let {page, limit, status,discount, category} = queryFavoriteDto
    page=page ||1
    limit=limit || 9
    const queryBuilder = this.favoriteDetailRepo
      .createQueryBuilder('favoriteDetail')
      .innerJoin('favoriteDetail.product', 'product')
      .innerJoin('product.images', 'images')
      .orderBy('favoriteDetail.createAt', 'DESC')
      .select([
       'favoriteDetail',
       'product.id',
       'product.name',
       'product.price',
       'product.pieceAvail',
       'product.reviewNumber',
       
       'images.url'
      ])
      .andWhere('favoriteDetail.userId=:userId', {userId})

      .skip((page - 1) * limit)
      .take(limit);

    if(status){
      if(status==='available'){
        queryBuilder.andWhere('product."pieceAvail">0')
      }else{
        queryBuilder.andWhere('product."pieceAvail"=0')
      }
    }
    
    if(discount){
      queryBuilder.andWhere('product."discountPrice" IS NOT NULL')
    }

    if(category){
      queryBuilder.andWhere('product."categoryName"=:category', {category})
    }

    const [data,count] = await queryBuilder.getManyAndCount();
    return {favoriteDetails: data ||[],count}
  }
  
  async deleteAbulk(userId: string, productIds: string[]){
   return this.favoriteDetailRepo.delete({userId, productId: In(productIds)})
  }
}
