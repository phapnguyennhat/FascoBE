import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { Profile } from './response/profile';
import { AuthBy, User } from 'src/database/entity/user.entity';

@Injectable()
export class FacebookAuthService {

  constructor(private readonly userService: UserService, private readonly configService: ConfigService, private readonly authService: AuthService){}

  async authenticate(token: string){
    const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`)
    const userData: Profile = await  response.json()
    const user: User = await this.userService.getByEmail(userData.email)
    
    if(user){
      return this.handleRegisterdUser(user)
    }
    
    return this.registerUser(userData)
  }

  async registerUser(userData: Profile){
    const user:User = await this.userService.createWithFacebook(userData)
    
    return this.handleRegisterdUser(user)
  }


  async handleRegisterdUser(user: User){
    // if(user.authBy !== AuthBy.FACEBOOK){
    //   throw new BadRequestException('Email đã có người sử dụng ')
    // }
    const {accessTokenCookie, refreshTokenCookie} = await this.getCookiesForUser(user)

    return  {accessTokenCookie, refreshTokenCookie, user}
    
  }

  async getCookiesForUser(user: User){
    const [accessTokenCookie, refreshTokenCookie]  = await Promise.all([this.authService.getCookieWithJwtAccessToken(user.id), this.authService.getCookieWithJwtRefreshToken(user.id)])

    return {
      accessTokenCookie, refreshTokenCookie
    }
  }
}
