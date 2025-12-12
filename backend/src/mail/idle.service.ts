import { Injectable, OnModuleDestroy, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as imaps from 'imap-simple';
import { MailGateway } from './mail.gateway';
import { EncryptionService } from '../auth/encryption.service';

@Injectable()
export class IdleService implements OnModuleDestroy {
    private connections = new Map<string, any>(); // userEmail -> imapConnection

    constructor(
        private configService: ConfigService,
        @Inject(forwardRef(() => MailGateway))
        private mailGateway: MailGateway,
        private encryptionService: EncryptionService
    ) { }

    async startIdle(user: { email: string; password?: string, encryptedPassword?: string }) {
        if (this.connections.has(user.email)) return; // Already idling

        let password = user.password;
        if (!password && user.encryptedPassword) {
            password = this.encryptionService.decrypt(user.encryptedPassword);
        }

        const config = {
            imap: {
                user: user.email,
                password: password || '',
                host: this.configService.get('IMAP_HOST'),
                port: this.configService.get('IMAP_PORT'),
                tls: true,
                authTimeout: 10000,
            },
            onmail: (numNew) => {
                // This callback fires when new mail arrives
                this.mailGateway.notifyNewMail(user.email, numNew);
            }
        };

        try {
            const connection = await imaps.connect(config);
            await connection.openBox('INBOX');
            // imap-simple handles IDLE internally if onmail is provided? 
            // Actually, we generally need to ensure the connection stays consistent. 
            // imap-simple's 'onmail' relies on the underlying node-imap 'mail' event.
            console.log(`IDLE started for ${user.email}`);
            this.connections.set(user.email, connection);

            connection.on('error', (err) => {
                console.error(`IDLE Error for ${user.email}`, err);
                this.stopIdle(user.email);
            });

            connection.on('close', () => {
                this.connections.delete(user.email);
            });

        } catch (e) {
            console.error(`Failed to start IDLE for ${user.email}`, e);
        }
    }

    stopIdle(userEmail: string) {
        const connection = this.connections.get(userEmail);
        if (connection) {
            connection.end();
            this.connections.delete(userEmail);
            console.log(`IDLE stopped for ${userEmail}`);
        }
    }

    onModuleDestroy() {
        for (const email of this.connections.keys()) {
            this.stopIdle(email);
        }
    }
}
