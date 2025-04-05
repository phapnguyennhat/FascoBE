import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { plainToInstance } from "class-transformer";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_RESET_PASSWORD_TOKEN } from "src/common/constant";
import { IAuthPayload, User } from "src/database/entity/user.entity";
import { UserService } from "src/module/user/user.service";

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(Strategy, JWT_RESET_PASSWORD_TOKEN) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.ResetPassword;
        },
      ]),
      secretOrKey: configService.get('JWT_CODE_TOKEN_SECRET'),
      
    });
  }

  async validate(payload: IAuthPayload) {
    
     return payload;
  }
}
