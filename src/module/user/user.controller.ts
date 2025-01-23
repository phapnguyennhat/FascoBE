import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: Request){
    return req.user
  }
}
