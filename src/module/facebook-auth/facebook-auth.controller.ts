import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookAuthGuard } from '../auth/guard/facebook-auth.guard';
import { Request } from "express";


@Controller('facebook-auth')
export class FacebookAuthController {
  constructor(private readonly facebookAuthService: FacebookAuthService) {}

  @Get("/facebook")
  @UseGuards(FacebookAuthGuard)
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }


  @Get("/facebook/redirect")
  @UseGuards(FacebookAuthGuard)
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

}
