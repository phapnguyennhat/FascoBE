import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
    constructor(
        private readonly authService: AuthService,

    ) { }
    async handleConnection(socket: Socket) {
        return this.authService.handleConnection(socket)
    }

    async handleDisconnect(socket: Socket) {
        return this.authService.handleDisconnect(socket)
    }

    getUserBySocket(socket: Socket) {
        return this.authService.getUserBySocket(socket)
    }

    

}
