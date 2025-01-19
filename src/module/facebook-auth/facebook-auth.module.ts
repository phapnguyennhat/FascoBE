import { Module } from '@nestjs/common';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookAuthController } from './facebook-auth.controller';
import { FacebookStrategy } from '../auth/passport/facebook.strategy';

@Module({
  controllers: [FacebookAuthController],
  providers: [FacebookAuthService, FacebookStrategy],
})
export class FacebookAuthModule {}
