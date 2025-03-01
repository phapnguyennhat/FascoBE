import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserService } from 'src/module/user/user.service';
import { IAuthPayload, User } from 'src/database/entity/user.entity';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      
    });
  }

  async validate(payload: IAuthPayload) {
    
    const user: User = plainToInstance(
      User,
      await this.userService.getById(payload.userId),
    );
    return user;
  }
}
