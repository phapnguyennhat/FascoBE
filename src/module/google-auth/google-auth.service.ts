import { UserService } from './../user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { AuthService } from '../auth/auth.service';
import { AuthBy, User } from 'src/database/entity/user.entity';

@Injectable()
export class GoogleAuthService {
  oauthClient: OAuth2Client;
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientId = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');
    this.oauthClient = new OAuth2Client({
      clientId,
      clientSecret,
    });
  }

  async authenticate(token: string) {
    const userData = await this.getAuthorData(token);
    const user = await this.userService.getByEmail(userData.email);
    if (user) {
      return this.handleRegisterdUser(user);
    }

    return this.registerUser(userData);
  }

  async registerUser(userData: TokenPayload) {
    const user: User = await this.userService.createWithGoogle(userData);

    return this.handleRegisterdUser(user);
  }

  async getAuthorData(token: string) {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_AUTH_CLIENT_ID'),
    });
    const payload = ticket.getPayload();
    return payload;
  }

  async handleRegisterdUser(user: User) {
    // if (user.authBy !== AuthBy.GOOGLE) {
    //   throw new BadRequestException('Email đã có người sử dụng');
    // }

    const { accessTokenCookie, refreshTokenCookie } =
      await this.getCookiesForUser(user);

    return {
      accessTokenCookie,
      refreshTokenCookie,
      user,
    };
  }

  async getCookiesForUser(user: User) {
    const accessTokenCookie =
      await this.authService.getCookieWithJwtAccessToken(user.id);
    const refreshTokenCookie =
      await this.authService.getCookieWithJwtRefreshToken(user.id);

   

    return {
      accessTokenCookie,
      refreshTokenCookie,
    };
  }
}
