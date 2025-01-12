import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_REFRESH_TOKEN } from 'src/common/constant';

@Injectable()
export default class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_TOKEN) {}
