import { Module } from '@nestjs/common';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookAuthController } from './facebook-auth.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [FacebookAuthController],
  providers: [FacebookAuthService],
})
export class FacebookAuthModule {}
