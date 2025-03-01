import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAuthPayload, User } from 'src/database/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import dayjs from 'dayjs';


@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ){}

  
  async setCurrentRefreshToken(refreshToken: string, authorId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    return this.userService.update(authorId, {
      currentHashedRefreshToken,
    });
  }

  getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async validateAuthor (account: string, password: string){
    let user: User = null
    if(isEmail(account)){
      user = await this.userService.getByEmail(account)
    }else{
      user = await this.userService.getByUsername(account)
    }
    if(!user){
      return null
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
    return null;
    }
    return user;
  }

  async getCookieWithJwtAccessToken(authorId: string) {
    const user: User = await this.userService.getById(authorId);
    const payload: IAuthPayload = {
      userId: user.id,
    };
    const token = this.jwtService.sign(payload);
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    return {
      token,
      accessTime: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      cookie,
    };
  }

  async verifyCode(email: string, code :string){
    await this.userService.verifyCode(email, code)
    const user = await this.userService.getByEmail(email)
    const payload: IAuthPayload = {
      userId: user.id,
    };
    const accessTime = this.configService.get('JWT_CODE_TOKEN_EXPIRATION_TIME') as number

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_CODE_TOKEN_SECRET'),
      expiresIn: `${accessTime}s`,
    })
    const cookie = `ResetPassword=${token}; HttpOnly; Path=/; Max-Age=${accessTime}`;
    return {
      token,
      accessTime,
      cookie
    }
    
  }

  async getCookieWithJwtRefreshToken(userId: string) {
     await this.userService.getById(userId);
    const payload: IAuthPayload = {
      userId,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
    return {
      cookie,
      accessTime: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      token,
    };
  }

  async resetPassword(user: User, password: string){
   
    if(user.codeExprired){
      await this.userService.changePassword(user.id, password)
    }else{
      throw new BadRequestException('Token is used already')
    }
        
  
  }
}
