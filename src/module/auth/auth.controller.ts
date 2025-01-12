import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import JwtAuthGuard from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import JwtRefreshGuard from './guard/jwtRefresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request) {
    await this.userService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return { message: 'Đăng xuất thành công' };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    const accessTokenCookie =
      await this.authService.getCookieWithJwtAccessToken(req.user?.id);
    const refreshTokenCookie =
      await this.authService.getCookieWithJwtRefreshToken(req.user?.id);
    await this.authService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      req.user?.id,
    );

    req.res.setHeader('Set-Cookie', [
      accessTokenCookie.cookie,
      refreshTokenCookie.cookie,
    ]);
    
    return { accessTokenCookie, refreshTokenCookie };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  async refresh(@Req() req) {
    const accessTokenCookie =
      await this.authService.getCookieWithJwtAccessToken(req.user.id);

    req.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
    return accessTokenCookie;
  }
}
