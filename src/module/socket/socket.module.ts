import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../log/log.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [AuthModule, LogModule, UserModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
