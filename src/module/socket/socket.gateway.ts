import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { ERole, IAuthPayload } from 'src/database/entity/user.entity';
import { LogService } from '../log/log.service';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserService } from '../user/user.service';
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect  {
  @WebSocketServer() server: Server;

  constructor(private readonly socketService: SocketService,
    private readonly logService: LogService,
    private readonly userService : UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache 
  ) { }

  async handleConnection(socket: Socket) {
    return this.socketService.handleConnection(socket)
  }

  async handleDisconnect(socket: Socket) {
    return this.socketService.handleDisconnect(socket)
  } 

  @SubscribeMessage('send_order_action')
  async sendOrderAction(@ConnectedSocket() socket: Socket, @MessageBody() {receiverId, message, href, orderId}: {receiverId:string , message: string , href: string, orderId: string}) {
    const payload = this.socketService.getUserBySocket(socket);

    if (payload.role === ERole.ADMIN) {
      await this.sendLogToUser(message, href, receiverId, orderId)
    } else if (payload.role === ERole.USER) { 
      await this.sendLogToAdmin(message, href, orderId)
    }
  }

  async sendLogToAdmin(message: string, href: string, orderId:string) { 
    const admins = await this.userService.findAllUserAdmin()
    await Promise.all(admins.map(async (admin) => {
      const socketId: string = await this.cacheManager.get(`socket:${admin.id}`)
      await this.logService.createLog({
        receiverId: admin.id,
        href,
        message
      })
      if (socketId) {
        this.server.to(socketId).emit('receive_log', {
          message, href
        })
      }
    }))
  }

  async sendLogToUser(message: string, href: string, receiverId: string, orderId: string) { 
    const receiverSocketId: string = await this.cacheManager.get(`socket:${receiverId}`)
    await this.logService.createLog({
      receiverId,
      href,
      message
    })
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_log', {
        message, href
      })
    }
  }
}
