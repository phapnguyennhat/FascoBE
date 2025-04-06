import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from 'src/database/entity/log.entity';
import { CreateLogDto } from './dto/createLog.dto';
import { QueryParam } from 'src/common/queryParam';
import { UserService } from '../user/user.service';
import { UpdateLogDto } from './dto/updateLog.dto';
import { ELogCollection, QueryLogDto } from './dto/queryLog.dto';

@Injectable()
export class LogService {

    constructor( @InjectRepository(Log  ) private readonly logRepo: Repository<Log>, private readonly userService: UserService){}

    async createLog(createLogDto: CreateLogDto) {
        return await this.logRepo.save(createLogDto)
    }

    async getLogByReceiverId(receiverId: string, query: QueryLogDto) { 
        const { page = 1, limit = 10, collection, createAt } = query
        
        const queryBuilder = this.logRepo.createQueryBuilder('log')
        .where('log.receiverId = :receiverId', { receiverId })
        .skip((page - 1) * limit)
            .take(limit)
        
        if (collection) {
            if(collection === ELogCollection.HASREAD) {
                queryBuilder.andWhere('log.hasRead = :hasRead', { hasRead: true })
            } else if (collection === ELogCollection.UNREAD) {
                queryBuilder.andWhere('log.hasRead = :hasRead', { hasRead: false })
            }
        }
        
        if(createAt) {
            queryBuilder.orderBy('log.createAt', createAt)
        }
        
       
        const [data, count] = await queryBuilder.getManyAndCount()
        const numPage = Math.ceil(count / limit)
        if (page + 1 > numPage) {
            return {data, currentPage:page, nextPage: null, count}
          }
          return {data, currentPage: page, nextPage: page+1, count  }
    }

    async updateLog(id: string, updateLogDto: UpdateLogDto) {
        return this.logRepo.update(id, updateLogDto)
    }

    async getLogById(id: string) {
        return this.logRepo.findOne({
            where: {
                id
            }
        })
    }

}   
