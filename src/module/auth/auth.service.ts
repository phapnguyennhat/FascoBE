import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAuthPayload, User } from 'src/database/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import dayjs from 'dayjs';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';


@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ){}

  


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
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar
    };
    const token = this.jwtService.sign(payload);
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}; SameSite=None; Secure`;
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
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar
    };
    const accessTime = this.configService.get('JWT_CODE_TOKEN_EXPIRATION_TIME') as number

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_CODE_TOKEN_SECRET'),
      expiresIn: `${accessTime}s`,
    })
    const cookie = `ResetPassword=${token}; HttpOnly; Path=/; Max-Age=${accessTime}; SameSite=None; Secure`;
    return {
      token,
      accessTime,
      cookie
    }
    
  }

  async getCookieWithJwtRefreshToken(userId: string) {
    const user = await this.userService.getById(userId);
    const payload: IAuthPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username,
      avatar: user.avatar
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
      const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}; SameSite=None; Secure`;
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


  getUserBySocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie || '';
    const { Refresh: refreshToken } = parse(cookie);
    const payload: IAuthPayload = this.jwtService.decode(refreshToken);

    if (!payload) {
      socket.disconnect();
      return;
    }
    if (!payload.id) {
      socket.disconnect();
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const ttl = payload.exp - now;

    if (ttl <= 0) {
      socket.disconnect();
      return;
    }
    return payload;
  }

  async handleConnection(socket: Socket) {
    const cookie = socket.handshake.headers.cookie || '';
    const { Refresh: refreshToken } = parse(cookie);
    const payload: IAuthPayload = this.jwtService.decode(refreshToken);

    if (!payload) {
      socket.disconnect();
      return;
    }
    if (!payload.id) {
      socket.disconnect();
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const ttl = payload.exp - now;

    if (ttl <= 0) {
      socket.disconnect();
      return;
    }
    console.log(`✅ User ${payload.name} connect to server`);
    await this.cacheManager.set(`socket:${payload.id}`, socket.id, ttl*1000);
  }

  async handleDisconnect(socket: Socket) {
    const payload = this.getUserBySocket(socket);
    console.log(`❌ User ${payload.name} disconnect server`);
    await this.cacheManager.del(`socket:${payload.id}`);
  }
}
