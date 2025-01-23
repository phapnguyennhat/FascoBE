import { Body, Controller, Get, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { FacebookAuthService } from './facebook-auth.service';
import { Request } from "express";
import { TokenVerifyDto } from '../google-auth/dto/tokenVerify.dto';


@Controller('facebook-auth')
export class FacebookAuthController {
  constructor(private readonly facebookAuthService: FacebookAuthService) {}


  @Post()
  async authenticate(@Body() tokenVerifyDto: TokenVerifyDto, @Req( ) req: Request){
    const {accessTokenCookie, refreshTokenCookie} = await this.facebookAuthService.authenticate(tokenVerifyDto.credential);

    req.res.setHeader('Set-Cookie', [accessTokenCookie.cookie, refreshTokenCookie.cookie]);
    return { accessTokenCookie, refreshTokenCookie};
  }
}
