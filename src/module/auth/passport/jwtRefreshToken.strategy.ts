import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JWT_REFRESH_TOKEN } from 'src/common/constant';
import { UserService } from 'src/module/user/user.service';
import { IAuthPayload } from 'src/database/entity/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_TOKEN,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: IAuthPayload) {
    const refreshToken = request.cookies?.Refresh;
    const isLogout = await this.cacheManager.get(`blacklist:${refreshToken}`)

    if (isLogout) {
      throw new UnauthorizedException('Token expire')
    }
    
    
    return payload;
  }
}
