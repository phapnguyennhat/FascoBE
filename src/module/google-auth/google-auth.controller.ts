import { Body, Controller, Post, Req } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { TokenVerifyDto } from './dto/tokenVerify.dto';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}
  @Post()
  async authenticate(@Body() tokenVerifyDto: TokenVerifyDto, @Req() req) {
    const { accessTokenCookie, refreshTokenCookie } =
      await this.googleAuthService.authenticate(tokenVerifyDto.credential);

    req.res.setHeader('Set-Cookie', [accessTokenCookie.cookie, refreshTokenCookie.cookie]);
    return { accessTokenCookie, refreshTokenCookie};
  }
}
