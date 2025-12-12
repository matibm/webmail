import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { IdleService } from './idle.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class MailGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private jwtService: JwtService,
        @Inject(forwardRef(() => IdleService))
        private idleService: IdleService
    ) { }

    async handleConnection(client: Socket) {
        try {
            // Auth via query token or auth header
            const token = client.handshake.query.token as string || client.handshake.headers.authorization?.split(' ')[1];
            if (!token) throw new Error('No token');

            const payload = this.jwtService.verify(token);
            client.data.user = payload; // { email, p } where p is encrypted password

            const email = payload.email;
            client.join(`user:${email}`);
            console.log(`Client connected: ${email}`);

            // Start IDLE for this user
            this.idleService.startIdle({ email, encryptedPassword: payload.p });

        } catch (e) {
            console.log('WS Auth failed', e.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        if (client.data.user) {
            console.log(`Client disconnected: ${client.data.user.email}`);
            // Optional: Stop IDLE if no more clients for this user are connected
            // For simplicity MVP, we might keep it or stop immediately.
            // Let's stop it to save resources.
            this.idleService.stopIdle(client.data.user.email);
        }
    }

    notifyNewMail(userEmail: string, count: number) {
        this.server.to(`user:${userEmail}`).emit('new-email', { count });
    }
}
