import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Inject, NotFoundException, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import JwtAuthGuard from './guard/jwt-auth.guard';
import JwtRefreshGuard from './guard/jwtRefresh.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { EmailService } from '../email/email.service';
import { EmailDto } from './dto/email.dto';
import dayjs from 'dayjs';
import { ConfirmDto } from './dto/confirm.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import  moment from 'moment-timezone';
import JwtResetPasswordGuard from './guard/jwtResetPassword.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import RequestWithUser from 'src/common/requestWithUser.interface';
import { JwtService } from '@nestjs/jwt';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

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
  async logout(@Req() request: RequestWithUser) {
    const refreshToken = request.cookies.Refresh
    const { exp } = this.jwtService.decode(refreshToken)
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;
    
    if (ttl > 0) {
      await this.cacheManager.set(`blacklist:${refreshToken}`,true, ttl*1000)
    }

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

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Req() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const { password, confirm_password, new_password } = updatePasswordDto;
    const user = await this.authService.validateAuthor(req.user.email,password)
    if(!user){
      throw new UnauthorizedException('Password is not correct')
    }
    if (confirm_password !== new_password) {
      throw new BadRequestException('Confirm password must match new password');
    }

    if (password === new_password) {
      throw new BadRequestException(
        'New password must  be different from the old password ',
      );
    }

    const result = await this.userService.updatePassword(req.user.id, updatePasswordDto);
    return result
  }

  @Post('resetPassword/code')
  async sendCodeResetPassword(@Body() { email }: EmailDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // gen 6 digit
    const codeExprired = dayjs().add(5, 'minutes');
    const formatDate = moment(codeExprired.format())
      .tz('Asia/Ho_Chi_Minh')
      .format('YYYY-MM-DD HH:mm:ss');

    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundException('Not found user');
    }
    await this.userService.genCode(email, code, formatDate);
    await this.emailService.sendCodeResetPassword(user.name, user.email, code)
 
    return { message: 'Send code successfully' };
  }

  @Post('resetPassword/confirm')
  async getTokenResetPassword(@Req() req ,@Body() { email, code }: ConfirmDto) {
    
    const resetPasswordCookie = await  this.authService.verifyCode(email, code);
    req.res.setHeader('Set-Cookie', resetPasswordCookie.cookie);
  
    return resetPasswordCookie
    
  }

  @Post('resetPassword')
  @UseGuards(JwtResetPasswordGuard)
  async resetPassword(@Body() {  password }: ResetPasswordDto, @Req() req: RequestWithUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.authService.resetPassword(req.user, hashedPassword);
    const removeCookie = 'ResetPassword=; HttpOnly; Path=/; Max-Age=0'
    req.res.setHeader('Set-Cookie',removeCookie);
    return {message: 'reset password successfully'}
  }
}
