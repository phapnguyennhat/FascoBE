import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_RESET_PASSWORD_TOKEN } from 'src/common/constant';

@Injectable()
export default class JwtResetPasswordGuard extends AuthGuard(
  JWT_RESET_PASSWORD_TOKEN,
) {}
