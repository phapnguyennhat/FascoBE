import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from 'src/database/entity/log.entity';
import { CreateLogDto } from './dto/createLog.dto';
import { QueryParam } from 'src/common/queryParam';
import { UserService } from '../user/user.service';
import { UpdateLogDto } from './dto/updateLog.dto';

@Injectable()
export class LogService {

    constructor( @InjectRepository(Log  ) private readonly logRepo: Repository<Log>, private readonly userService: UserService){}

    async createLog(createLogDto: CreateLogDto) {
        if (!createLogDto.receiverId) {
            const admins = await this.userService.findAllUserAdmin()
            const adminIds = admins.map(admin => admin.id)
            await Promise.all(adminIds.map(async (adminId) => {
                await this.logRepo.save({
                    ...createLogDto,
                    receiverId: adminId
                })
            }))
            return {message: 'Log created successfully'}
        }
        return await this.logRepo.save(createLogDto)
    }

    async getLogByReceiverId(receiverId: string, query: QueryParam) { 
        const {page=1, limit=10} = query
       
        return this.logRepo.find({
            where: {
                receiverId
            },
            order: {
                createAt: 'DESC'
            },
            skip: (page - 1) * limit,
            take: limit
        })
    }

    async updateLog(id: string, updateLogDto: UpdateLogDto) {
        return this.logRepo.update(id, updateLogDto)
    }

}   
