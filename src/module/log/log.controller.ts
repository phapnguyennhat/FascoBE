import { Body, Controller, ForbiddenException, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { QueryParam } from 'src/common/queryParam';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { UpdateLogDto } from './dto/updateLog.dto';
import { QueryLogDto } from './dto/queryLog.dto';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) { }
  
  @Get() 
  @UseGuards(JwtAuthGuard)
  async getLog(@Req() req, @Query() query: QueryLogDto) { 
    return this.logService.getLogByReceiverId(req.user.id, query)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateLog(@Req() req, @Param('id') id: string, @Body() updateLogDto: UpdateLogDto) { 
  
    const log = await this.logService.getLogById(id)
    if(log.receiverId !== req.user.id) {
      throw new ForbiddenException('You are not allowed to update this log')
    }
    return this.logService.updateLog(id, updateLogDto)
  }
}
